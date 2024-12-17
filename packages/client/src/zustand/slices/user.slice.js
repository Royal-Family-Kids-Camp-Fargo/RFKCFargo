import SessionApi from '../../api/sessions';
import UserApi from '../../api/user';

// Initialize the APIs
const sessionApi = new SessionApi();
const userApi = new UserApi();

const createUserSlice = (set, get) => ({
  user: {},
  userById: {},
  authErrorMessage: '',
  isInitialized: false,

  initializeAuth: async () => {
    if (get().isInitialized) return;

    try {
      // Check if we have valid stored credentials
      const hasValidSession = await sessionApi.validateAndRefreshSession();
      
      if (hasValidSession) {
        // If we have valid credentials, fetch the user data
        await get().fetchUser();
      } else {
        // If no valid credentials, perform anonymous authentication
        await sessionApi.anonymousAuthenticate();
      }
    } catch (error) {
      console.error('Authentication initialization error:', error);
      // Fallback to anonymous auth if something goes wrong
      await sessionApi.anonymousAuthenticate();
    } finally {
      set({ isInitialized: true });
    }
  },

  fetchUser: async () => {
    try {
      const userData = await userApi.getCurrentUser();
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

  register: async (newUserCredentials) => {
    get().setAuthErrorMessage('');
    try {
      await sessionApi.register({
        login: newUserCredentials.username,
        password: newUserCredentials.password,
        firstName: newUserCredentials.first_name,
        lastName: newUserCredentials.last_name,
      });
      get().fetchUser();
    } catch (err) {
      console.log('register error:', err);
      get().setAuthErrorMessage('Oops! Registration failed. That username might already be taken. Try again!');
    }
  },

  logIn: async (userCredentials) => {
    get().setAuthErrorMessage('');
    try {
      await sessionApi.authenticate({
        login: userCredentials.username,
        password: userCredentials.password,
      });
      get().fetchUser();
    } catch (err) {
      console.log('logIn error:', err);
      get().setAuthErrorMessage('Oops! Login failed. You have entered an invalid username or password. Try again!');
    }
  },

  logOut: async () => {
    try {
      await sessionApi.logout();
      set({ user: {} });
    } catch (err) {
      console.log('logOut error:', err);
    }
  },

  setAuthErrorMessage: (message) => {
    set({ authErrorMessage: message });
  },
});

export default createUserSlice;
