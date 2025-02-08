import { BaseApi } from './base.js';
import type { PipelineStatus } from './pipelineStatus.js';
import { inheritFields } from '~/utils/objects.js';
import { PipelineStatusApi } from './pipelineStatus.js';

export interface PipelineInput {
  name: string;
  type: string;
  location_id: string;
}

export interface Pipeline extends PipelineInput {
  id: string;
  pipeline_status_collection: PipelineStatus[];
}

class PipelineApi extends BaseApi<Pipeline, PipelineInput> {
  protected get model() {
    return 'pipeline';
  }
  protected get path() {
    return '/query';
  }
  protected get fields() {
    return [
      'id',
      'name',
      'type',
      'location_id',
      ...inheritFields(new PipelineStatusApi(), 'pipeline_status_collection'),
    ];
  }
}

const pipelineApi = new PipelineApi();

export default pipelineApi;
