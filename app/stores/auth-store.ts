export type Developer = {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly roleId: string;
};

let accessToken: string | undefined = undefined;
let developer: Developer | undefined = undefined;

export const authStore = {
  getAccessToken: () => accessToken,
  setAccessToken: (token: string) => {
    accessToken = token;
  },
  getDeveloper: () => developer,
  setDeveloper: (dev: Developer) => {
    developer = dev;
  },
  clear: () => {
    accessToken = undefined;
    developer = undefined;
  },
};
