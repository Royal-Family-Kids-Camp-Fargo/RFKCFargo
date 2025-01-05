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
    model = "pipeline_status";
    fields = [
      "id",
      "order",
      "pipeline_id",
      "name",
      ...inheritFields(new UserApi(), "user_collection")
    ];
    path = "/pipeline_status";
}

const pipelineStatusApi = new PipelineStatusApi();

export default pipelineStatusApi;