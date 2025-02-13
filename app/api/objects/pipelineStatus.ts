import { BaseApi } from './base.js';

export interface PipelineStatusInput {
  order: number;
  pipeline_id: string;
  name: string;
}

export interface PipelineStatus extends PipelineStatusInput {
  id: string;
}

export class PipelineStatusApi extends BaseApi<
  PipelineStatus,
  PipelineStatusInput
> {
  protected get model() {
    return 'pipeline_status';
  }
  protected get fields() {
    return ['id', 'order', 'pipeline_id', 'name'];
  }
  protected get path() {
    return '/query';
  }

  async updateUserStatus({
    userId,
    fromStatusId,
    toStatusId,
  }: {
    userId: string;
    fromStatusId: string;
    toStatusId: string;
  }) {
    console.log('updateUserStatus', userId, fromStatusId, toStatusId);
    return 'ok';
  }
}

const pipelineStatusApi = new PipelineStatusApi();

export default pipelineStatusApi;
