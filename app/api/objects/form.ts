import { BaseApi } from "./base.js";

export type Form = {
  id: string;
  name: string;
  location_id: string;
  archived: boolean;
  locationId: number;
  pipelineId: number;
};

class FormApi extends BaseApi {
  protected get model() { return "forms"; }
  protected get path() { return "/query"; }
  protected get fields() { 
    return [
        "id",
        "name",
        "location_id",
        "archived",
        "locationId",
        "pipelineId",
        ];
    }
}

const formApi = new FormApi();

export default formApi;
