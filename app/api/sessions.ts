import { getBaseRequest } from './base-requests';
import { userApi } from './objects/user';
import { authStore } from '~/stores/authStore';
const tenantId = '10250';

async function anonymousLogin() {
  const requestOptions = getBaseRequest({
    path: `/anonauth`,
    method: 'POST',
    body: {
      tenantid: parseInt(tenantId),
    },
  });

  const res = await fetch(requestOptions);

  console.log(res);

  return res;
}

async function getRoleId() {
  const requestOptions = getBaseRequest({
    path: `/roles_pbac`,
    method: 'GET',
  });

  const res = await fetch(requestOptions);

  return res;
}

export async function login(email: string, password: string) {
  const data = {
    login: email,
    password: password,
    tenantid: parseInt(tenantId),
  };

  const requestOptions = getBaseRequest({
    path: `/auth`,
    method: 'POST',
    body: data,
  });

  const res = await fetch(requestOptions);
  const json = await res.json();
  
  authStore.setAccessToken(json.access_token);
  const user = await userApi.get(json.roleid);

  console.log(json.access_token);

  return { user, access_token: json.access_token };
}

export async function signup(email: string, password: string, name?: string) {
  const data = {
    name,
    email,
    password,
  };

  const requestOptions = getBaseRequest({
    path: `/auth`,
    method: 'POST',
    body: data,
  });

  const res = await fetch(requestOptions);

  return res;
}

/**
 * Gets and sets a new access token using the refresh token saved in cookies.
 *
 * @returns A redirect to the sign-in page if refresh fails.
 */
export async function refresh(): Promise<Response> {
  console.log('refreshing --- > TO implement');
  return new Response('Not implemented');
  // const requestOptions = getBaseRequest({
  //   path: `/auth`,
  //   includeCredentials: true,
  //   method: 'GET',
  // });

  // const res = await fetch(requestOptions);

  // return res;
}

export async function logout() {
  const requestOptions = getBaseRequest({
    path: `/auth`,
    method: 'DELETE',
  });

  const res = await fetch(requestOptions);

  return res;
}
