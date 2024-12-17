// packages/client/src/api/user.js
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import BaseApi from "./base";

class UserApi extends BaseApi {
  constructor() {
    super();
    const token = localStorage.getItem("accessToken");

    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        }
      }
    });

    this.client = new ApolloClient({
      link: authLink.concat(
        new HttpLink({
          uri: "https://api.devii.io/query",
          credentials: "same-origin",
        })
      ),
      cache: new InMemoryCache(),
    });
  }

  async getCurrentUser() {
    const query = gql`
      query GetCurrentUser {
        currentUser {
          id
          username
          email
          firstName
          lastName
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const response = await this.client.query({ query });
      return response.data.currentUser;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }

  async getUserById(userId) {
    const query = gql`
      query GetUserById($userId: ID!) {
        user(id: $userId) {
          id
          username
          email
          firstName
          lastName
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const response = await this.client.query({
        query,
        variables: { userId },
      });
      return response.data.user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }
}

export default UserApi;
