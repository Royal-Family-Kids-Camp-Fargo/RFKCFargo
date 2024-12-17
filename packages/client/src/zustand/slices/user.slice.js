import { userApi } from '../../api/user';

const createUserSlice = (set, get) => ({
  user: {},
  userById: {},
  authErrorMessage: '',
  isInitialized: false,


  fetchUser: async () => {
    try {
      const userData = await userApi.get();
      set({ user: userData });
    } catch (err) {
      console.log('fetchUser error:', err);
      set({ user: {} });
    }
  },

  fetchUserById: async (userId) => {
    try {
      const userData = await userApi.getUserById(userId);
      set({ userById: userData });
    } catch (err) {
      console.error('fetchUserById error:', err);
      set({ userById: {} });
    }
  },

  setAuthErrorMessage: (message) => {
    set({ authErrorMessage: message });
  },
});

export default createUserSlice;
