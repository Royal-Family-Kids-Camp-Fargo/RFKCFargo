import { create } from "zustand";
import userSlice from './user.slice'
import loginRegisterSlice from './loginRegistration.slice'


const useStore = create( (...args) => ({
    ...userSlice(...args),
    ...loginRegisterSlice(...args)
}))

export default useStore;