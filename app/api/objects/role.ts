import BaseApi from "./base";

export type Role = {
    roleid: string;
    name: string;
    login: string;
    classes: {
        classid: string;
        name: string;
    }[];
}

export class RoleApi extends BaseApi {
  constructor() {
    super("role", [
      "roleid",
      "name",
      "login", 
      "classes.classid",
      "classes.name"
    ], "/roles_pbac");
  }

  async get(roleId: string) {
    return super.get(null, `roleid = "${roleId}"`);
  }
}

// Create a singleton instance
export const roleApi = new RoleApi();

// For backward compatibility
export default roleApi;
