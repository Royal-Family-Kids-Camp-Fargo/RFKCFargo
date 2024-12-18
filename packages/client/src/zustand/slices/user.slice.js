const createUserSlice = (set, get) => ({
  roleId: null,
  classes: [],
  locationId: null,
  setRoleId: (roleId) => set({ roleId }),
  setClasses: (classes) => set({ classes }),
  setLocationId: (locationId) => set({ locationId }),
});

export default createUserSlice;
