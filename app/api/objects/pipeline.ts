import { BaseApi } from "./base.js";

export type Pipeline = {
  id: string;
  name: string;
  type: string;
  location_id: string;
};

class PipelineApi extends BaseApi {
  protected get model() {
    return "pipeline";
  }
  protected get path() {
    return "/query";
  }
  protected get fields() {
    return ["id", "name", "type", "location_id"];
  }
}

const pipelineApi = new PipelineApi();

export default pipelineApi;
