import { getBaseRequest } from './base-requests';
import { UserApi } from './objects/user';
import { authStore } from '~/stores/authStore.client';
import { baseUrl } from './base-requests';
import { RoleApi } from './objects/role';

const tenantId = import.meta.env.VITE_DEVII_TENANT_ID;

async function anonymousLogin() {
  const requestOptions = getBaseRequest({
    path: `/anonauth`,
    method: 'POST',
    body: {
      tenantid: tenantId,
    },
  });

  const res = await fetch(requestOptions);

  return res;
}

export async function requestPasswordReset(email: string): Promise<boolean> {
  const anonymousResponse = await anonymousLogin();
  const anonymousJson = await anonymousResponse.json();
  const accessToken = anonymousJson.access_token;

  const res = await fetch(`${baseUrl}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation ($input: password_resetInput) {
          create_password_reset(
            input: $input, onconflict: update
          ) {
            email
            reset_count
          }
        }
      `,
      variables: { input: { email, reset_count: 0 } },
    }),
  });

  const json = await res.json();

  return res.ok;
}

export async function resetPassword(
  accessToken: string,
  roleid: number,
  password: string
) {
  const roleApi = new RoleApi(accessToken);

  const roleResponse = await roleApi.get(roleid.toString());

  if ('error' in roleResponse || !roleResponse.data) {
    return roleResponse;
  }

  const role = roleResponse.data;

  const updatedRole = await roleApi.update(
    roleid.toString(),
    {
      name: role.name,
      login: role.login,
      password: password,
      tenantid: tenantId.toString(),
    },
    'roleid'
  );

  if ('error' in updatedRole) {
    return updatedRole;
  }

  return updatedRole;
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
    tenantid: tenantId,
  };

  const requestOptions = getBaseRequest({
    path: `/auth`,
    method: 'POST',
    body: data,
  });

  const res = await fetch(requestOptions);
  if (!res.ok) {
    throw new Error('Login failed');
  }
  const json = await res.json();
  const user = await new UserApi(json.access_token).get(json.roleid);

  if ('error' in user) {
    throw new Error(user.error?.message);
  }

  return { user, access_token: json.access_token, roleid: json.roleid };
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
export async function refresh(refreshToken: string, setAuth: boolean = true) {
  const res = await fetch(`${baseUrl}/auth`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  if (!res.ok) {
    return { error: 'Refresh token expired' };
  }
  const json = await res.json();
  if (setAuth) {
    authStore.setAuth({ access_token: json.access_token, roleid: json.roleid });
  }
  return { user: json.user, access_token: json.access_token };
}

export async function logout() {
  const requestOptions = getBaseRequest({
    path: `/auth`,
    method: 'DELETE',
  });

  const res = await fetch(requestOptions);

  return res;
}
