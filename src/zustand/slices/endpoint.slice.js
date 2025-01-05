const createEndpointSlice = (set) => ({
  latestEndpoints: Array(9).fill(null),
  setEndpoints: (endpoints) => set({ latestEndpoints: endpoints }),
});

export default createEndpointSlice;
