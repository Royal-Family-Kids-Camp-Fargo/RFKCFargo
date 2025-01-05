import BaseApi from "./base";
import { RoleApi } from "./role";
import type { Role } from "./role";

export type User = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    location_id: string;
    created_at: string;
    updated_at: string;
    role: Role;
}

export class UserApi extends BaseApi {
    roleApi: RoleApi;

    constructor() {
        super("user", [
        "id",
        "email",
        "first_name",
        "last_name",
        "phone_number",
        "location_id",
        "created_at",
        "updated_at",
        ])
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
