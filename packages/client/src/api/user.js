// packages/client/src/api/user.js
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import BaseApi from "./base";

/**
 * @typedef {Object} UserInput
 * @property {string} email - User's email address
 * @property {string} first_name - User's first name
 * @property {string} last_name - User's last name
 * @property {string} [phone_number] - User's phone number (optional)
 */

/**
 * @typedef {Object} User
 * @property {string} id - User's unique identifier
 * @property {string} email - User's email address
 * @property {string} first_name - User's first name
 * @property {string} last_name - User's last name
 * @property {string} [phone_number] - User's phone number
 * @property {string} devii_roleid - User's role ID
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

export class UserApi extends BaseApi {
  constructor() {
    super();
    this.model = "user";
    this.fields = [
      "id",
      "email",
      "first_name",
      "last_name",
      "phone_number",
      "location_id",
      "created_at",
      "updated_at",
      "devii_roleid",
    ];
  }

  async getByRoleId(roleId) {
    return super.get(null, `devii_roleid = "${roleId}"`);
  }

}

// Create a singleton instance
export const userApi = new UserApi();

// For backward compatibility
export default userApi;
