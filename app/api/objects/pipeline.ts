import BaseApi from "./base.js";

export type Pipeline = {
  id: string;
  name: string;
  type: string;
  location_id: string;
};

class PipelineApi extends BaseApi {
  constructor() {
    super('pipeline', ['id', 'name', 'type', 'location_id']);
  }
}

const pipelineApi = new PipelineApi();

export default pipelineApi;