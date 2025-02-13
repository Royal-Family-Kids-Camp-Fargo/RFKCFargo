import type { User } from '../api/objects/user';

type Auth = {
  access_token: string;
  roleid: string;
};

// let auth: { access_token: string; roleid: string } | undefined = undefined;
let user: User | undefined = undefined;

export const authStore = {
  getAuth: () => {
    const storedAuth = localStorage.getItem('auth');
    let auth: Auth | undefined = undefined;
    if (storedAuth) {
      auth = JSON.parse(storedAuth);
    }
    return auth;
  },
  setAuth: (input: Auth) => {
    localStorage.setItem('auth', JSON.stringify(input));
  },
  logout: () => {
    localStorage.removeItem('auth');
    user = undefined;
  },
  getUser: () => user,
  setUser: (dev: User) => {
    user = dev;
  },
  clear: () => {
    localStorage.removeItem('auth');
    user = undefined;
  },
};
