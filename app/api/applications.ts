import { getBaseRequest } from './base-requests';

const basePath = '/portal/applications';

export async function getApplications() {
  const requestOptions = getBaseRequest({
    path: basePath,
  });
  const response = await fetch(requestOptions);

  const json = await response.json();

  const applications = json.data;

  return applications;
}
