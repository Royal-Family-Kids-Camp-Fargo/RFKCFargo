import { getBaseRequest } from './base-requests';

const basePath = '/portal/sessions';

export async function login(email: string, password: string) {
  const data = {
    email,
    password,
  };

  const requestOptions = getBaseRequest({
    path: `${basePath}/login`,
    method: 'POST',
    body: data,
  });

  const res = await fetch(requestOptions);

  return res;
}

export async function signup(email: string, password: string, name?: string) {
  const data = {
    name,
    email,
    password,
  };

  const requestOptions = getBaseRequest({
    path: `${basePath}/signup`,
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
  const requestOptions = getBaseRequest({
    path: `${basePath}/refresh`,
    includeCredentials: true,
    method: 'POST',
  });

  const res = await fetch(requestOptions);

  return res;
}

export async function logout() {
  const requestOptions = getBaseRequest({
    path: `${basePath}/logout`,
    method: 'POST',
  });

  const res = await fetch(requestOptions);

  return res;
}
