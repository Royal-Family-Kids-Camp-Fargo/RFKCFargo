import { BaseApi } from './base.js';

export interface FormInput {
  name: string;
  location_id: string;
  archived: boolean;
  locationId: number;
  pipelineId: number;
}

export interface Form extends FormInput {
  id: string;
}

class FormApi extends BaseApi<Form, FormInput> {
  protected get model() {
    return 'forms';
  }
  protected get path() {
    return '/query';
  }
  protected get fields() {
    return [
      'id',
      'name',
      'location_id',
      'archived',
      'locationId',
      'pipelineId',
    ];
  }
}

const formApi = new FormApi();

export default formApi;
