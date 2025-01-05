import type { User } from "../api/objects/user";

let accessToken: string | undefined = undefined;
let user: User | undefined = undefined;

export const authStore = {
  getAccessToken: () => accessToken,
  setAccessToken: (token: string) => {
    accessToken = token;
  },
  getUser: () => user,
  setUser: (dev: User) => {
    user = dev;
  },
  clear: () => {
    accessToken = undefined;
    user = undefined;
  },
};
