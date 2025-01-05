// packages/client/src/api/user.js
import BaseApi from "./base";

export class UserLocationApi extends BaseApi {
  constructor() {
    super();
    this.model = "user_location";
    this.fields = [
      "user_id",
      "location_id",
      "role",
      "created_at",
      "updated_at"
    ];
  }
}