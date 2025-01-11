import BaseApi from "./base.js";

class Pipeline extends BaseApi {
  constructor() {
    super();
    this.model = "pipeline";
    this.fields = ["id", "name", "type", "location_id"];
  }
}

const pipelineApi = new Pipeline();

export default pipelineApi;
