const createUserSlice = (set, get) => ({
  roleId: null,
  classes: [],
  setRoleId: (roleId) => set({ roleId }),
  setClasses: (classes) => set({ classes }),
});

export default createUserSlice;
