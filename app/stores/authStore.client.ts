import type { User } from "../api/objects/user";

let auth: { access_token: string; roleid: string } | undefined = undefined;
let user: User | undefined = undefined;

export const authStore = {
  getAuth: () => {
    if (!auth) {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        auth = JSON.parse(storedAuth);
      }
    }
    return auth;
  },
  setAuth: ({
    access_token,
    roleid,
  }: {
    access_token: string;
    roleid: string;
  }) => {
    auth = { access_token, roleid };
  },
  logout: () => {
    auth = undefined;
    user = undefined;
    localStorage.removeItem("auth");
  },
  getUser: () => user,
  setUser: (dev: User) => {
    user = dev;
  },
  clear: () => {
    auth = undefined;
    user = undefined;
  },
};
