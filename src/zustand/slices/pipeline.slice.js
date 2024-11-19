import axios from 'axios';

const createPipelineSlice = (set, get) => ({
  pipelines: [],
  selectedPipeline: {},
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

  fetchPipelineById: async (pipelineId) => {
    // Retrieves the selected pipeline from /api/pipeline/:pipelineId endpoint.
    // going to need a pipeline id as a payload from Pipeline component
    try {
      const { data } = await axios.get(`/api/pipeline/${pipelineId}`);
      console.log('data from store', data);
      set({ selectedPipeline: data });
    } catch (err) {
      console.log('fetch PipelineById error:', err);
      set({ selectedPipeline: {} });
    }
  },
});
export default createPipelineSlice;
