import BaseApi from "./base.js";

class PipelineStatus extends BaseApi {
  constructor() {
    super();
    this.model = "pipeline_status";
    this.fields = [
      "id",
      "order",
      "pipeline_id",
      "name"
    ];
  }
}

const pipelineStatusApi = new PipelineStatus();

export default pipelineStatusApi;