import { BaseApi } from "./base.js";

export type SmsTemplate = {
  id: string;
  user_id: string;
  is_shared: boolean;
  title: string;
  template: string;
};

class SmsTemplateApi extends BaseApi {
  protected get model() {
    return "sms_template";
  }
  protected get path() {
    return "/query";
  }
  protected get fields() {
    return [
      "id",
      "user_id",
      "is_shared",
      "title",
      "template"
    ];
  }
}

const smsTemplateApi = new SmsTemplateApi();

export default smsTemplateApi;