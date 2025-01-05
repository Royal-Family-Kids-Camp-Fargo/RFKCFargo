import BaseApi from "./base";

export type Form = {
  id: string;
  name: string;
  location_id: string;
  archived: boolean;
  locationId: number;
  pipelineId: number;
};

class FormApi extends BaseApi {
  constructor() {
    super('forms', [
      'id',
      'name',
      'location_id',
      'archived',
      'locationId',
      'pipelineId',
    ]);
  }
}

const formApi = new FormApi();

export default formApi;
