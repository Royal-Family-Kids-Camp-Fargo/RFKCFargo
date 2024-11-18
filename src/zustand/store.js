import { create } from "zustand";
import userSlice from './slices/user.slice.js';

import pipelineSlice from './slices/pipeline.slice.js'


// Combine all slices in the store:
const useStore = create((...args) => ({
  ...userSlice(...args),
  ...pipelineSlice(...args),
}));


export default useStore;
