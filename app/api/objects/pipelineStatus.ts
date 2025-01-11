import { BaseApi } from "./base.js";
import { inheritFields } from "~/utils/objects.js";
import { UserPipelineStatusApi } from "./userPipelineStatus.js";
import type { UserPipelineStatus } from "./userPipelineStatus.js";

export type PipelineStatus = {
  id: string;
  order: number;
  pipeline_id: string;
  name: string;
  user_pipeline_status_collection: UserPipelineStatus[];
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
      ...inheritFields(
        new UserPipelineStatusApi(),
        "user_pipeline_status_collection"
      ),
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
