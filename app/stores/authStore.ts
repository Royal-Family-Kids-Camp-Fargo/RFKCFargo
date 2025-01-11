import type { User } from "../api/objects/user";

let auth: { access_token: string; roleid: string } | undefined = undefined;
let user: User | undefined = undefined;

export const authStore = {
  getAuth: () => auth,
  setAuth: ({
    access_token,
    roleid,
  }: {
    access_token: string;
    roleid: string;
  }) => {
    auth = { access_token, roleid };
  },
  getUser: () => user,
  setUser: (dev: User) => {
    user = dev;
    localStorage.setItem("user", JSON.stringify(dev));
  },
  clear: () => {
    auth = undefined;
    user = undefined;
  },
};
