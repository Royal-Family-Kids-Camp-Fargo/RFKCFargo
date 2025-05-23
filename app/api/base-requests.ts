import { authStore } from '~/stores/authStore.client';

export const baseUrl = import.meta.env.VITE_DEVII_BASE_URL;

type BaseRequestOptions = {
  path?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  withAccessToken?: boolean;
  includeCredentials?: boolean;
};

export function getBaseRequest(options: BaseRequestOptions): Request {
  let {
    path,
    method,
    body,
    withAccessToken = true,
    includeCredentials = false,
  } = options;

  let url = baseUrl;
  if (path) {
    path = path.startsWith('/') ? path : `/${path}`;
    url = baseUrl + path;
  }

  const accessToken = authStore.getAuth();

  return new Request(url, {
    method: method,
    body: JSON.stringify(body),
    credentials: includeCredentials ? 'include' : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...(withAccessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
}
