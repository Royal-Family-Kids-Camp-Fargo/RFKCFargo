import axios from 'axios';

axios.defaults.withCredentials = true;


const createRegisterLoginSlice = (set, get) => ({
    register: async (payload) => {
        //get() allows you to call/access other slice's parts
        get().setAuthErrorMessage('')
        try {
            await axios.post('/api/user/register', payload);
            get().login(payload);
        } catch (err) {
            console.log(err)
            get().setAuthErrorMessage ( `Oops! That didn't work. The username might already be taken. Try again!`)
    
        }
    },
    login: async (payload) => {
        get().setAuthErrorMessage('')
        try {
            //zustand doesnt care about waiting
            await axios.post('/api/user/login', payload);;
            get().fetchUser()
        } catch (err) {
            console.log(err)
            if (err.response.status === 401) {
                // The 401 is the error status sent from passport
                // if user isn't in the database or
                // if the username and password don't match in the database
                get().setAuthErrorMessage(`Oops! The username and password didn't match. Try again!`)
              } else {
                // Got an error that wasn't a 401
                // Could be anything, but most common cause is the server is not started
                get().setAuthErrorMessage( `Oops! Something went wrong! Is the server running?`);
              }
        }
    }
})

export default createRegisterLoginSlice;
