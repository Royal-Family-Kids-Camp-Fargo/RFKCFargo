import { BaseApi } from './base.js';

export interface TagInput {
  name: string;
}

export interface Tag extends TagInput {
  id: string;
}

class TagApi extends BaseApi<Tag, TagInput> {
  protected get model() {
    return 'tags';
  }
  protected get path() {
    return '/query';
  }
  protected get fields() {
    return [
      'id',
      'name',
    ];
  }
}

const tagApi = new TagApi();

export default tagApi;
