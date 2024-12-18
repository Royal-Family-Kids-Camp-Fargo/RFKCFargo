import BaseApi from "./base.js";

class PipelineStatus extends BaseApi {
  constructor() {
    super();
    this.model = "pipeline_status";
    this.fields = [
      "id",
      "order",
      "pipeline_id",
      "name",
      "user_collection.id",
      "user_collection.first_name",
      "user_collection.last_name",
      "user_collection.email",
      "user_collection.phone_number",
      "user_collection.location_id",
    ];
  }
}

const pipelineStatusApi = new PipelineStatus();

export default pipelineStatusApi;