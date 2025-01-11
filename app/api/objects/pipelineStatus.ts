import { BaseApi } from "./base.js";
import { inheritFields } from "~/utils/objects.js";
import { UserApi } from "./user.js";

export type PipelineStatus = {
  id: string;
  order: number;
  pipeline_id: string;
  name: string;
};

class PipelineStatusApi extends BaseApi {
  protected get model() {
    return "pipeline_status";
  }
  protected get fields() {
    return [
      "id",
      "order",
      "pipeline_id",
      "name",
      ...inheritFields(new UserApi(), "user_collection"),
    ];
  }
  protected get path() {
    return "/query";
  }

  async updateUserStatus({
    userId,
    fromStatusId,
    toStatusId,
  }: {
    userId: string;
    fromStatusId: string;
    toStatusId: string;
  }) {
    console.log("updateUserStatus", userId, fromStatusId, toStatusId);
    return "ok";
  }
}

const pipelineStatusApi = new PipelineStatusApi();

export default pipelineStatusApi;
