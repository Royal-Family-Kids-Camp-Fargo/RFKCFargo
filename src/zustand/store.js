import { create } from "zustand";
import userSlice from './user.slice'
import loginRegisterSlice from './loginRegistration.slice'

const logStyle = {
    prevState: 'color: #9E9E9E; font-weight: bold;',
    action: 'color: #03A9F4; font-weight: bold;',
    nextState: 'color: #4CAF50; font-weight: bold;',
};

// Logger Middleware
const logger = (config) => (set, get, api) =>
    config(
        (args) => {
            console.group('Zustand State Changed')
            // Log Previous State
            console.log('%cPrevious State:', logStyle.prevState, get());

            // Log Action
            if (typeof args === 'function') {
                console.log('%cAction: FUNCTION', logStyle.action, args.toString());
            } else if (typeof args === 'object') {
                console.log('%cAction:', logStyle.action, args);
            }

            // Apply the State Change
            set(args);

            // Log Next State
            console.log('%cNext State:', logStyle.nextState, get());
            console.groupEnd()

        },
        get,
        api
    );

//combine all slices in the store
const useStore = create(logger((...args) => ({
    ...userSlice(...args),
    ...loginRegisterSlice(...args)
})))

export default useStore;