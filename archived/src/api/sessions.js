import axios from "axios";
import settings from "../config/settings";
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { userApi } from "./user";
import useUserStore from "../zustand/slices/user.slice";

class SessionApi {
  constructor() {
    this.baseUrl = "https://api.devii.io";
    this.anonymousRoleId = "anonymous"; // Set your anonymous role ID here

    const authLink = setContext((_, { headers }) => {
      const token = localStorage.getItem("accessToken");
      console.log("token:", token);
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    this.rbacClient = new ApolloClient({
      link: authLink.concat(
        new HttpLink({
          uri: "https://api.devii.io/roles_pbac",
          credentials: "same-origin",
        })
      ),
      cache: new InMemoryCache(),
    });
  }

  hasStoredCredentials() {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    return token && refreshToken;
  }

  async validateAndRefreshSession() {
    if (!this.hasStoredCredentials()) {
      return false;
    }

    try {
      // Try to validate the current token by making a test query
      // const response = await axios.get(`${this.baseUrl}/query`, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      //   },
      // });

      // if (response.status === 200) {
      //   const roleId = this._getRole(response.data.roleid);
      //   return response.data.roleid;
      // } else {
      // }
      return this._refreshSession();
    } catch (error) {
      // If the token is invalid, clear storage and return false
      this.logout();
      return false;
    }
  }

  async _refreshSession() {
    try {
      const response = await axios.get(`${this.baseUrl}/auth`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      });
      console.log("refresh session response", response);
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        roleid: roleId,
      } = response.data;

      this._setTokens({ accessToken, refreshToken, roleId });
      const role = await this._getRole(roleId);
      const user = await userApi.getByRoleId(roleId);
      console.log("refresh session roleId", roleId);
      return { ...role, ...user };
    } catch (error) {
      this.logout();
      return false;
    }
  }

  async register(userCredentials) {
    try {
      await this._createRole(userCredentials, settings.userClassId);
      const tokens = await this.login({
        login: userCredentials.login,
        password: userCredentials.password,
      });

      try {
        await userApi.create({
          email: userCredentials.login,
          first_name: userCredentials.firstName,
          last_name: userCredentials.lastName,
          devii_roleid: tokens.roleId,
          location_id: settings.locationId,
        });
      } catch (error) {
        this._deleteRole(tokens.roleId);
        throw new Error("User not created", error);
      }

      return tokens;
    } catch (error) {
      console.error("Role Creation Error:", error);
      throw error;
    }
  }

  async anonymousAuthenticate() {
    try {
      const tokens = await this._getTokens("anonauth", {
        tenantid: settings.tenantId,
      });
      console.log("Anonymous tokens api", tokens);
      return tokens;
    } catch (error) {
      console.error("Anonymous Authentication Error:", error);
      throw error;
    }
  }

  async login(userCredentials) {
    if (!userCredentials.login || !userCredentials.password) {
      throw new Error("Username and password are required");
    }

    try {
      const tokens = await this._getTokens("auth", {
        login: userCredentials.login,
        password: userCredentials.password,
        tenantid: settings.tenantId,
      });
      const role = await this._getRole(tokens.roleId);

      return { ...tokens, ...role };
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  }

  async _getRole(roleId) {
    const filter = `roleid = ${roleId}`;
    const response = await this.rbacClient.query({
      query: gql`
        query GetRole($filter: String!) {
          role(filter: $filter) {
            roleid
            name
            classes {
              classid
            }
          }
        }
      `,
      variables: { filter },
    });
    const { roleid, name, classes } = response.data.role[0];
    return { roleid, name, classes: classes.map((c) => c.classid) };
  }

  async _getTokens(url, vars) {
    try {
      const response = await axios.post(`${this.baseUrl}/${url}`, vars);

      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        roleid: roleId,
      } = response.data;

      this._setTokens({ accessToken, refreshToken });

      return { accessToken, refreshToken, roleId };
    } catch (error) {
      console.error("Token Retrieval Error:", error);
      throw error;
    }
  }

  _setTokens(tokens) {
    localStorage.setItem("accessToken", String(tokens.accessToken));
    localStorage.setItem("refreshToken", String(tokens.refreshToken));
  }

  async _createRole(userCredentials, classId) {
    const mutation = gql`
      mutation CreateRole($input: roleInput!) {
        create_role(input: $input) {
          roleid
        }
      }
    `;

    const variables = {
      input: {
        name: userCredentials.firstName + " " + userCredentials.lastName,
        login: userCredentials.login,
        tenantid: settings.tenantId,
        password: userCredentials.password,
        classes: [classId],
      },
    };

    try {
      const response = await this.rbacClient.mutate({
        mutation,
        variables,
      });
      console.log("role created", response);
      return response.data.create_role;
    } catch (error) {
      console.error("Role Creation Error:", response);
      throw error;
    }
  }

  async _deleteRole(roleId) {
    const mutation = gql`
      mutation DeleteRole($input: roleInput!) {
        delete_role(id: $input) {
          roleid
        }
      }
    `;

    const variables = {
      input: {
        roleid: roleId,
      },
    };

    try {
      const response = await this.rbacClient.mutate({
        mutation,
        variables,
      });
      return response.data;
    } catch (error) {
      console.error("Role Deletion Error:", error);
      throw error;
    }
  }

  async logout() {
    console.log("logging out");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export const sessionApi = new SessionApi();

export default sessionApi;
