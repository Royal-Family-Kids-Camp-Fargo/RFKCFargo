import { create } from "zustand";
import userSlice from './user.slice'
import loginRegisterSlice from './loginRegistration.slice'

//combine all slices in the store
const useStore = create( (...args) => ({
    ...userSlice(...args),
    ...loginRegisterSlice(...args)
}))

export default useStore;