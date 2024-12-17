import axios from 'axios';

const createPipelineSlice = (set, get) => ({
  pipelines: [],
  selectedPipeline: {},
  foundUsers: [],
  selectedUserId: '',
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

  searchingApplicant: async (searchString) => {
    //  Retrieves the users data from the /api/pipeline/search?term= endpoint.
    // build up search endpoint
    const baseUrl = '/api/pipeline/search';
    const params = { term: searchString };

    try {
      const { data } = await axios.get(baseUrl, { params });
      console.log('search data', data);
      set({ foundUsers: data });
    } catch (err) {
      console.log('error finding user:', err);
      set({ foundUsers: [] });
    }
  },

  clearFoundUsers: () => {
    set({ foundUsers: [] });
  },

  setSelectedUserId: (userId) => {
    set(() => ({
      // '{user.id: 1, first_name: 'joe'}'
      selectedUserId: userId,
    }));
  },

  addUserStatus: async (userStatus) => {
    try {
      await axios.post('/api/pipeline/user_status', userStatus);
      get().fetchPipelineById(userStatus.pipeline_id);
      console.log('data refreshed');
    } catch (err) {
      alert('Server error: possible duplicate record');
    }
  },

  addPipeline: async (newPipeline) => {
    //  Post the pipeline data from the /api/pipeline endpoint.
    try {
      const { data } = await axios.post('/api/pipeline', newPipeline);
      //refresh the data in dropdown selections
      get().fetchPipeline();
      console.log('data refreshed');
      console.log('new pipeline id', data.data);
      get().fetchPipelineById(data.data);
    } catch (err) {
      console.log('error creating new pipeline', err);
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

  moveUserOnPipeline: async (moveObject) => {
    try {
      await axios.put('/api/pipeline/user_status', moveObject);
      console.log('user has been moved on the pipeline');
      get().fetchPipelineById(moveObject.pipeline_id);
    } catch (err) {
      console.error('error moving user through pipeline');
    }
  },

  deleteUserFromPipeline: async (removeObject) => {
    // use a removeObject looks like this: {userId}
    try {
      await axios.delete(`api/pipeline/user_status/${removeObject.user_id}/${removeObject.pipeline_status_id}`);
      console.log('user deleted from the pipeline');
      get().fetchPipelineById(removeObject.pipeline_id);
    } catch (err) {
      console.error('Error deleting user from pipeline:', err);
      alert('Failed to delete user from pipeline.');
    }
  },
});
export default createPipelineSlice;
