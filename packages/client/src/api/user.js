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
      "created_at",
      "updated_at",
      "devii_roleid",
    ];
  }

  /**
   * Create a new user
   * @param {UserInput} input - The user data to create
   * @returns {Promise<User>} The created user
   */
  async create(input) {
    return super.create(input);
  }

  /**
   * Get a user by ID
   * @param {string} id - The user ID
   * @returns {Promise<User>} The user data
   */
  async get(id) {
    return super.get(id);
  }

  /**
   * Update a user
   * @param {string} id - The user ID
   * @param {Partial<UserInput>} input - The fields to update
   * @returns {Promise<User>} The updated user
   */
  async update(id, input) {
    return super.update(id, input);
  }

  /**
   * Delete a user
   * @param {string} id - The user ID to delete
   * @returns {Promise<{ success: boolean }>} Success status
   */
  async delete(id) {
    return super.delete(id);
  }
}

// Create a singleton instance
export const userApi = new UserApi();

// For backward compatibility
export default userApi;
