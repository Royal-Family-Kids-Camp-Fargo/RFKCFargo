// packages/client/src/api/base.js
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

class BaseApi {
  constructor() {
    const token = localStorage.getItem('accessToken'); // Retrieve token from local storage

    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        }
      }
    });

    this.queryClient = new ApolloClient({
      link: authLink.concat(new HttpLink({
        uri: "https://api.devii.io/query", // Your GraphQL endpoint
        credentials: "same-origin", // Include credentials if needed
      })),
      cache: new InMemoryCache(),
    });
    this.model = "OVERRIDE_ME";
    this.fields = [];
  }

  async get(id) {
    const filter = `id: "${id}"`;
    return this._query(`query Get${this.model}($filter: String) {
      ${this.model}(filter: $filter) {
        ${this.fields.join('\n')}
      }
    }`, { filter });
  }

  // Generic query method
  async _query(query, variables = {}) {
    try {
      const response = await this.client.query({
        query: gql`
          ${query}
        `,
        variables,
      });
      return response.data;
    } catch (error) {
      console.error("GraphQL Query Error:", error);
      throw error;
    }
  }

  // Generic mutation method
  async _mutate(mutation, variables = {}) {
    try {
      const response = await this.client.mutate({
        mutation: gql`
          ${mutation}
        `,
        variables,
      });
      return response.data;
    } catch (error) {
      console.error("GraphQL Mutation Error:", error);
      throw error;
    }
  }
}

export default BaseApi;
