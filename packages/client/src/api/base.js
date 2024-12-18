// packages/client/src/api/base.js
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

/**
 * @typedef {Object} BaseModelFields
 * @property {string} id - The unique identifier
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

/**
 * @typedef {Object} CreateModelResponse
 * @property {string} id - The ID of the created record
 */

class BaseApi {
  constructor() {
    const authLink = setContext((_, { headers }) => {
      const token = localStorage.getItem('accessToken');
      console.log('token:', token);
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        }
      };
    });

    this.client = new ApolloClient({
      link: authLink.concat(new HttpLink({
        uri: "https://api.devii.io/query",
        credentials: "same-origin",
      })),
      cache: new InMemoryCache(),
    });
    this.model = "OVERRIDE_ME";
    this.fields = [];
  }

  /**
   * Create a new record
   * @template T
   * @param {T} input - The data to create the record with
   * @returns {Promise<T & BaseModelFields>} The created record
   */
  async create(input) {
    const mutation = gql`
      mutation Create${this.model}($input: ${this.model}Input!) {
        create_${this.model}(input: $input) {
          ${this.fields.join('\n')}
        }
      }
    `;

    try {
      const response = await this.client.mutate({
        mutation,
        variables: { input },
      });
      return response.data[`create_${this.model}`];
    } catch (error) {
      console.error(`Error creating ${this.model}:`, error);
      throw error;
    }
  }

  /**
   * Get a record by ID
   * @param {string} id - The ID of the record to fetch
   * @returns {Promise<BaseModelFields>} The fetched record
   */
  async get(id, filter = null) {
    if (filter === null) {
      filter = `id = "${id}"`;
    }
    const query = gql`
      query Get${this.model}($filter: String) {
        ${this.model}(filter: $filter) {
          ${this.fields.join('\n')}
        }
      }
    `;

    try {
      const response = await this.client.query({
        query,
        variables: { filter },
      });
      if (response.data[this.model].length === 0) {
        return null;
      }
      return response.data[this.model][0];
    } catch (error) {
      console.error(`Error fetching ${this.model}:`, error);
      throw error;
    }
  }

  async getAll(pagination = { limit: 10, offset: 0, ordering: "", filter: "" }) {
    console.log('pagination', pagination);
    console.log('this.model', this.model);
    const subquery = `query{ ${this.model} { id } }`;
    const query = gql`
      query GetAll${this.model}($subquery: String, $filter: String, $limit: Int, $ordering: [String], $offset: Int) {
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
          ${this.fields.join("\n")}
        }
      }
    `;
    console.log('query', query);

    try {
      const response = await this.client.query({
        query,
        variables: { ...pagination, subquery }
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
      throw error;
    }
  }

  /**
   * Update a record
   * @template T
   * @param {string} id - The ID of the record to update
   * @param {Partial<T>} input - The fields to update
   * @returns {Promise<T & BaseModelFields>} The updated record
   */
  async update(id, input) {
    const mutation = gql`
      mutation Update${this.model}($id: ID!, $input: ${this.model}Input!) {
        update_${this.model}(id: $id, input: $input) {
          ${this.fields.join('\n')}
        }
      }
    `;

    try {
      const response = await this.client.mutate({
        mutation,
        variables: { id, input },
      });
      return response.data[`update_${this.model}`];
    } catch (error) {
      console.error(`Error updating ${this.model}:`, error);
      throw error;
    }
  }

  /**
   * Delete a record
   * @param {string} id - The ID of the record to delete
   * @returns {Promise<{ success: boolean }>} Success status
   */
  async delete(id) {
    const mutation = gql`
      mutation Delete${this.model}($id: ID!) {
        delete_${this.model}(id: $id) {
          success
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
      throw error;
    }
  }
}

export default BaseApi;
