import { ApolloClient as ApolloClientClass } from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";
import { HttpLink } from "@apollo/client/link/http";
import { gql } from "@apollo/client/core";
import type { NormalizedCacheObject } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { settings } from "../../config/settings";
import { authStore } from "../../stores/auth-store";

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

export abstract class BaseApi {
    private client!: ApolloClientClass<NormalizedCacheObject>;
    
    // Make these abstract getters instead of properties
    protected abstract get model(): string;
    protected abstract get path(): string;
    protected abstract get fields(): string[];

    constructor() {
        this.initializeClient();
    }

    private initializeClient() {
        const authLink = setContext((_, { headers }) => {
            const token = authStore.getAccessToken();
            return {
                headers: {
                    ...headers,
                    authorization: token ? `Bearer ${token}` : "",
                }
            };
        });

        const baseUrl = settings.apiUrl.replace(/\/+$/, '');
        const apiPath = this.path.replace(/^\/+/, '');
        const fullUrl = `${baseUrl}/${apiPath}`;

        this.client = new ApolloClientClass({
            link: authLink.concat(new HttpLink({ 
                uri: fullUrl,
                credentials: "same-origin",
            })),
            cache: new InMemoryCache(),
        });
    }

    getFields() {
        return this.fields;
    }

    formatFields(fields: string[]) {
        const buildFieldMap = (fields: string[]) => {
            const fieldMap: Record<string, string[]> = {};

            fields.forEach(field => {
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
            return Object.entries(fieldMap).map(([parent, children]) => {
                if (children.length > 0) {
                    const nestedFields = formatFieldMap(buildFieldMap(children));
                    return `${parent} { ${nestedFields} }`;
                }
                return parent;
            }).join('\n');
        };

        const fieldMap = buildFieldMap(fields);
        return formatFieldMap(fieldMap);
    }

    /**
     * Create a new record
     * @template T
     * @param {T} input - The data to create the record with
     * @returns {Promise<T & BaseModelFields>} The created record
     */
    async create(input: any) {
        const mutation = gql`
            mutation Create${this.model}($input: ${this.model}Input!) {
                create_${this.model}(input: $input) {
                    ${this.formatFields(this.fields)}
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
    async get(id: string | null = null, filter: string | null = null) {
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
                    ${this.formatFields(this.fields)}
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
    async update(id: string, input: any) {
        const mutation = gql`
            mutation Update${this.model}($id: ID!, $input: ${this.model}Input!) {
                update_${this.model}(id: $id, input: $input) {
                    ${this.formatFields(this.fields)}
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
    async delete(id: string) {
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
