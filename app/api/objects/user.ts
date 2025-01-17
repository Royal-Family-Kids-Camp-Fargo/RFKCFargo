import { BaseApi } from "./base.js";
import { RoleApi } from "./role.js";
import type { Role } from "./role.js";
import type { UserPipelineStatus } from "./userPipelineStatus.js";

type UserDefault = {
  first_name: string;
  last_name: string;
  email?: string;
};

export type UserBase = UserDefault & {
  id: string;
};

export type UserCreate = UserBase & {
  phone_number?: string;
  location_id: string;
  assigned_to?: string;
  city?: string;
};

export type User = UserBase & {
  phone_number: string;
  location_id: string;
  created_at: string;
  updated_at: string;
  user?: UserBase; // This is the user that is assigned to the pipeline status
  role: Role;
  user_pipeline_status_collection: UserPipelineStatus[];
};

export class UserApi extends BaseApi {
  protected get model() {
    return "user";
  }
  protected get path() {
    return "/query";
  }
  protected get fields() {
    return [
      "id",
      "email",
      "first_name",
      "last_name",
      "phone_number",
      "location_id",
      "created_at",
      "updated_at",
      "user.id",
      "user.email",
      "user.first_name",
      "user.last_name",
      "user_pipeline_status_collection.pipeline_status_id",
    ];
  }
  roleApi: RoleApi;

  constructor() {
    super();
    this.roleApi = new RoleApi();
  }

  async get(roleId: string) {
    const [result, role] = await Promise.all([
      super.get(null, `devii_roleid = "${roleId}"`),
      this.roleApi.get(roleId),
    ]);
    if (result instanceof Error) {
      return result;
    }
    return { ...result, role } as User;
  }
}

// Create a singleton instance
export const userApi = new UserApi();

// For backward compatibility
export default userApi;
