import { BaseApi } from "./base.js";
import { RoleApi } from "./role.js";
import type { Role } from "./role.js";

export type UserBase = {
    id: string
    email: string;
    first_name: string;
    last_name: string;
}

export type User = UserBase & {
    phone_number: string;
    location_id: string;
    created_at: string;
    updated_at: string;
    assigned_to?: UserBase;
    role: Role;
}

export class UserApi extends BaseApi {
    protected get model() { return "user"; }
    protected get path() { return "/query"; }
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
        "user.last_name"
        ];
    }
    roleApi: RoleApi;

    constructor() {
        super();
        this.roleApi = new RoleApi();
    }

    async get(roleId: string) {
        const result = await super.get(null, `devii_roleid = "${roleId}"`);
        const role = await this.roleApi.get(result.role.roleid);
        return { ...result, role } as User;
    }

}

// Create a singleton instance
export const userApi = new UserApi();

// For backward compatibility
export default userApi;