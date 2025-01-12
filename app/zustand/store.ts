import { create } from "zustand";
import actionSlice from "./slices/action.slice";
import botSlice from "./slices/bot.slice";

// Combine all slices in the store:
const useStore = create((set, get) => ({
  ...actionSlice(set, get),
  ...botSlice(set, get),
}));

export default useStore;
