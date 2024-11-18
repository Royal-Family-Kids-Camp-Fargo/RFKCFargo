import axios from 'axios';

const createPipelineSlice = (set, get) => ({
  pipelines: [],
  fetchPipeline: async () => {
    //  Retrieves the pipelines data from the /api/pipeline endpoint.
    try {
      const { data } = await axios.get('/api/pipeline');
      console.log('data from store', data);
      set({ pipelines: data });
    } catch (err) {
      console.log('fetchPipeline error:', err);
      set({ pipelines: [] });
    }
  },
});
export default createPipelineSlice;
