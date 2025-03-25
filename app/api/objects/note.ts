import { BaseApi } from './base.js';
import type { User } from './user.js';

export type NoteInput = {
  note: string;
  created_by_id: number;
  user_id: number;
};

export type Note = NoteInput & {
  id: string;
  created_at: string;
  updated_at: string;
  created_by_id_user?: User;
  user_id_user?: User;
};

export class NoteApi extends BaseApi<Note, NoteInput> {
  protected get model() {
    return 'note';
  }
  
  protected get path() {
    return '/query';
  }
  
  protected get fields() {
    return [
      'id',
      'note',
      'created_at',
      'updated_at',
      'created_by_id',
      'user_id',
      'created_by_id_user.id',
      'created_by_id_user.first_name',
      'created_by_id_user.last_name',
      'created_by_id_user.email',
      'user_id_user.id',
      'user_id_user.first_name',
      'user_id_user.last_name',
      'user_id_user.email',
    ];
  }
}

// Create a singleton instance
export const noteApi = new NoteApi();

// For backward compatibility
export default noteApi;
