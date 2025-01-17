import { BaseApi } from "./base.js";
import { UserApi } from "./user.js";
import { inheritFields } from "~/utils/objects.js";
import type { User } from "./user.js";

export type UserPipelineStatus = {
  user_id: string;
  pipeline_status_id: string;
  pipeline_id: string;
  user: User;
};

export class UserPipelineStatusApi extends BaseApi {
  protected get model() {
    return "user_pipeline_status";
  }

  protected get path() {
    return "/query";
  }

  protected get fields() {
    return [
      "user_id",
      "pipeline_status_id",
      "pipeline_id",
      ...inheritFields(new UserApi(), "user"),
    ];
  }

  async movePipelineStatus(
    userId: string,
    pipelineId: string,
    newStatusId: string
  ) {
    console.log("Moving pipeline status for user", userId, "to", newStatusId);
    return await super.create(
      {
        pipeline_status_id: newStatusId,
        user_id: userId,
        pipeline_id: pipelineId,
      },
      "update"
    );
  }
}

const userPipelineStatusApi = new UserPipelineStatusApi();

export default userPipelineStatusApi;
