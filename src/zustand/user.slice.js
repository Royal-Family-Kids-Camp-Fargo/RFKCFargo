import axios from 'axios';

axios.defaults.withCredentials = true;

//slice of state, including functionality
const createUserSlice = (set, get) => ({
    authErrorMessage: '',
    setAuthErrorMessage: (message) => set({authErrorMessage : message}),
    user: {},
    fetchUser: async () => {
        try {
            const { data } = await axios.get('/api/user');
            set({ user: data })
        } catch (err) {
            console.log(err)
            set({user : {}})
        }

    },
    logout : async () => {
        await axios.post('/api/user/logout')
        set({user : {}})
    }
})

export default createUserSlice;