const createActionSlice = (set: any, get: any) => ({
  latestActions: Array(9).fill(null),
  setActions: (actions: any) => set({ latestActions: actions }),
});

export default createActionSlice;
