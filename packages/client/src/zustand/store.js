import { create } from "zustand";
import userSlice from './slices/user.slice.js';
import pipelineSlice from './slices/pipeline.slice.js';
import formSlice from './slices/form.slice.js';
import submissionSlice from './slices/submission.slice.js';
import sectionSlice from './slices/section.slice.js';
import questionSlice from './slices/question.slice.js';
import createActionSlice from './slices/action.slice.js';

// Combine all slices in the store:
const useStore = create((set, get) => ({
  ...userSlice(set, get),
  ...pipelineSlice(set, get),
  ...formSlice(set, get),
  ...submissionSlice(set, get),
  ...sectionSlice(set, get),
  ...questionSlice(set, get),
  ...createActionSlice(set, get)
}));


export default useStore;
