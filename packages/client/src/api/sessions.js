import axios from 'axios';
import settings from '../config/settings';
import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { userApi } from './user';

class SessionApi {
  constructor() {
    this.baseUrl = "https://api.devii.io";
    this.anonymousRoleId = "anonymous"; // Set your anonymous role ID here
    
    const authLink = setContext((_, { headers }) => {
      const token = localStorage.getItem("accessToken");
      console.log('token:', token);
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
    const roleId = localStorage.getItem("roleId");
    return token && roleId && roleId !== this.anonymousRoleId;
  }

  async validateAndRefreshSession() {
    if (!this.hasStoredCredentials()) {
      return false;
    }

    try {
      // Try to validate the current token by making a test query
      const response = await axios.get(`${this.baseUrl}/query`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      
      if (response.status === 200) {
        return true;
      } else {
        return this._refreshSession();
      }
    } catch (error) {
      // If the token is invalid, clear storage and return false
      this.logout();
      return false;
    }
  }

  async _refreshSession() {
    try {
      const response = await axios.get(`${this.baseUrl}/query`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      });
      const { access_token: accessToken, refresh_token: refreshToken, roleid: roleId } = response.data;

      this._setTokens({ accessToken, refreshToken, roleId });

      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  async register(userCredentials) {
    try {
      await this._createRole(userCredentials, settings.userClassId);
      const tokens = await this._getTokens("auth", {
        login: userCredentials.login,
        password: userCredentials.password,
        tenantid: settings.tenantId,
      });
      const user = await userApi.create({
        email: userCredentials.login,
        first_name: userCredentials.firstName,
        last_name: userCredentials.lastName,
        devii_roleid: tokens.roleId,
      });
      return { tokens, user };
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

    return this._getTokens("auth", {
      login: userCredentials.login,
      password: userCredentials.password,
      tenantid: settings.tenantId,
    });
  }

  async _getTokens(url, vars) {
    const response = await axios.post(`${this.baseUrl}/${url}`, vars);

    const { access_token: accessToken, refresh_token: refreshToken, roleid: roleId } = response.data;

    this._setTokens({ accessToken, refreshToken, roleId });

    return { accessToken, refreshToken, roleId };
  }

  _setTokens(tokens) {
    localStorage.setItem("accessToken", String(tokens.accessToken));
    localStorage.setItem("refreshToken", String(tokens.refreshToken));
    localStorage.setItem("roleId", String(tokens.roleId));
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
      return response.data.createRole;
    } catch (error) {
      console.error("Role Creation Error:", error);
      throw error;
    }
  }

  async logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("roleId");
  }
}

export const sessionApi = new SessionApi();

export default sessionApi;