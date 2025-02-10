import { ApolloClient as ApolloClientClass } from '@apollo/client/core';
import { InMemoryCache } from '@apollo/client/cache';
import { HttpLink } from '@apollo/client/link/http';
import { gql } from '@apollo/client/core';
import type { NormalizedCacheObject } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { settings } from '../../config/settings';
import { authStore } from '../../stores/authStore.client';
import { onError } from '@apollo/client/link/error';
import { from } from '@apollo/client/link/core';

export type ApiError = {
  error: {
    message: string;
    status: number;
  };
};

// Extend BaseApi with generic types
export abstract class BaseApi<TModel, TInput> {
  private client!: ApolloClientClass<NormalizedCacheObject>;

  protected abstract get model(): string;
  protected abstract get path(): string;
  protected abstract get fields(): string[];

  constructor(authToken?: string) {
    this.initializeClient(authToken);
  }

  private initializeClient(authToken?: string) {
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message }) => {
          console.error(`[GraphQL error]: ${message}`);
        });
      }
      if (networkError) {
        console.error(`[Network error]: ${networkError}`);
      }
    });

    const authLink = setContext((_, prevContext) => {
      const auth = authStore.getAuth();
      const token = authToken || (auth ? auth.access_token : '');
      return {
        headers: {
          ...(prevContext?.headers || {}),
          authorization: token ? `Bearer ${token}` : '',
        },
      };
    });

    const baseUrl = settings.apiUrl.replace(/\/+$/, '');
    const apiPath = this.path.replace(/^\/+/, '');
    const fullUrl = `${baseUrl}/${apiPath}`;

    this.client = new ApolloClientClass({
      link: from([
        errorLink,
        authLink,
        new HttpLink({
          uri: fullUrl,
          credentials: 'same-origin',
        }),
      ]),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore',
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore',
        },
        mutate: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore',
        },
      },
    });
  }

  getFields(): string[] {
    return this.fields;
  }

  formatFields(fields: string[]): string {
    const buildFieldMap = (fields: string[]): Record<string, string[]> => {
      const fieldMap: Record<string, string[]> = {};

      fields.forEach((field) => {
        const parts = field.split('.');
        const [parent, ...rest] = parts;
        if (!fieldMap[parent]) {
          fieldMap[parent] = [];
        }
        if (rest.length > 0) {
          fieldMap[parent].push(rest.join('.'));
        }
      });

      return fieldMap;
    };

    const formatFieldMap = (fieldMap: Record<string, string[]>): string => {
      return Object.entries(fieldMap)
        .map(([parent, children]) => {
          if (children.length > 0) {
            const nestedFields = formatFieldMap(buildFieldMap(children));
            return `${parent} { ${nestedFields} }`;
          }
          return parent;
        })
        .join('\n');
    };

    const fieldMap = buildFieldMap(fields);
    return formatFieldMap(fieldMap);
  }

  async create(
    input: TInput,
    onconflict: string = 'fail'
  ): Promise<{ data: TModel }> {
    const mutation = gql`
            mutation Create${this.model}($input: ${this.model}Input!) {
                create_${this.model}(input: $input, onconflict: ${onconflict}) {
                    ${this.formatFields(this.fields)}
                }
            }
        `;

    try {
      const response = await this.client.mutate({
        mutation,
        variables: { input, onconflict },
      });
      return { data: response.data[`create_${this.model}`] };
    } catch (error) {
      console.error(`Error creating ${this.model}:`, error);
      throw error;
    }
  }

  async get(
    id: string | null = null,
    filter: string | null = null
  ): Promise<{ data: TModel | null } | ApiError> {
    if (id !== null) {
      filter = `id = "${id}"`;
    }
    const query = gql`
            query Get${this.model}($filter: String) {
                ${this.model}(filter: $filter) {
                    ${this.formatFields(this.fields)}
                }
            }
        `;

    try {
      const response = await this.client.query({
        query,
        variables: { filter },
      });
      if (response.data[this.model].length === 0) {
        return { data: null };
      }
      return { data: response.data[this.model][0] };
    } catch (error) {
      console.error(`Error fetching ${this.model}:`, error);
      let status = 400;
      if (String(error).includes('expired')) {
        status = 401;
      }
      return {
        error: {
          message: `Error fetching ${this.model}: ${error}`,
          status: status,
        },
      };
    }
  }

  async getAll(
    pagination: {
      limit: number;
      offset: number;
      ordering: string;
      filter: string;
    } = { limit: 10, offset: 0, ordering: '', filter: '' },
    field_to_count: string = 'id'
  ): Promise<
    | {
        data: TModel[];
        total: number;
        limit: number;
        offset: number;
        ordering: string;
        filter: string;
      }
    | ApiError
  > {
    const subquery = `query{ ${this.model} { ${field_to_count} } }`;
    const query = gql`
            query GetAll${
              this.model
            }($subquery: String, $filter: String, $limit: Int, $ordering: [String], $offset: Int) {
                Aggregates {
                    count(
                        subquery: $subquery,
                        filter: $filter
                    )
                }
                ${this.model}(
                    limit: $limit, 
                    offset: $offset, 
                    ordering: $ordering,
                    filter: $filter
                ) {
                    ${this.formatFields(this.fields)}
                }
            }
        `;
    console.log('query', query);

    try {
      const response = await this.client.query({
        query,
        variables: { ...pagination, subquery },
      });
      return {
        data: response.data[this.model],
        total: response.data.Aggregates.count,
        limit: pagination.limit,
        offset: pagination.offset,
        ordering: pagination.ordering,
        filter: pagination.filter,
      };
    } catch (error) {
      console.error(`Error fetching ${this.model}:`, error);
      return {
        error: {
          message: `Error fetching ${this.model}: ${error}`,
          status: 400,
        },
      };
    }
  }

  async update(
    id: string | Record<string, string>,
    input: Partial<TInput>,
    idName: string = 'id'
  ): Promise<{ data: TModel }> {
    console.log('id', id);
    let id_string = '';
    let id_vars = '';
    let id_values: Record<string, string> = {};
    if (typeof id === 'string') {
      id_string = `$${idName}: ID!`;
      id_vars = `${idName}: $${idName}`;
      id_values = { [idName]: id };
    } else {
      id_string = Object.entries(id)
        .map(([key, value]) => `$${key}: ID!`)
        .join(', ');
      id_vars = Object.entries(id)
        .map(([key, value]) => `${key}: $${key}`)
        .join(', ');
      id_values = id;
    }
    console.log('id_values', id_values);
    try {
      const mutation = gql`
        mutation Update${this.model}(${id_string}, $input: ${
          this.model
        }Input!) {
          update_${this.model}(${id_vars}, input: $input) {
            ${this.formatFields(this.fields)}
          }
        }
      `;
      console.log('mutation', mutation);
      console.log('id_values', mutation, id_values, input);
      const response = await this.client.mutate({
        mutation,
        variables: { ...id_values, input },
      });
      return { data: response.data[`update_${this.model}`] };
    } catch (error) {
      console.error(`Error updating ${this.model}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<{ success: boolean } | ApiError> {
    const mutation = gql`
            mutation Delete${this.model}($id: ID!) {
                delete_${this.model}(id: $id) {
                    id
                }
            }
        `;

    try {
      const response = await this.client.mutate({
        mutation,
        variables: { id },
      });
      return response.data[`delete_${this.model}`];
    } catch (error) {
      console.error(`Error deleting ${this.model}:`, error);
      return {
        error: {
          message: `Error deleting ${this.model}: ${error}`,
          status: 400,
        },
      };
    }
  }
}
