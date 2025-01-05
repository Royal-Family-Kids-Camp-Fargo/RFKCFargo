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
  protected readonly model = "form";
  protected readonly path = "/query";
  protected readonly fields = [
    "id",
    "name",
    "location_id",
    "archived",
    "locationId",
    "pipelineId",
  ];
}

const formApi = new FormApi();

export default formApi;
