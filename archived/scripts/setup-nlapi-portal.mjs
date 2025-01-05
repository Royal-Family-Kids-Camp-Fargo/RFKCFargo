// setup-nlapi-portal.js

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['NLAPI_DEV_USER', 'NLAPI_DEV_PASSWORD', 'NGROK_URL', 'DEVII_TENANT_ID'];

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(
    'Missing required environment variables:',
    missingEnvVars.join(', ')
  );
  process.exit(1);
}
async function getAccessToken() {
  const response = await fetch('https://api.nlapi.io/portal/sessions/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: process.env.NLAPI_DEV_USER,
      password: process.env.NLAPI_DEV_PASSWORD,
    }),
  });
  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    developerId: data.developer_id,
  };
}

async function createApplication(accessToken, developerId) {
  const response = await fetch('https://api.nlapi.io/portal/applications', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name: 'RFK Central',
      api_url: process.env.NGROK_URL, // Use your ngrok URL
      description: 'RFK Central',
      api_type: 'devii',
      tenant_id: process.env.DEVII_TENANT_ID,
      developer_id: developerId, // Use your developer ID
    }),
  });

  const data = await response.json();
  console.log('Application created:', data);
  return data.id;
}

async function createApiKey(applicationId, accessToken) {
  const response = await fetch('https://api.nlapi.io/portal/api-keys', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      application_id: applicationId,
    }),
  });

  const data = await response.json();
  console.log('API Key created:', data);
  return data.api_key;
}

(async () => {
  try {
    let applicationId;
    const { accessToken, developerId } = await getAccessToken();
    if (process.env.NLAPI_APPLICATION_ID) {
      console.log('Application already exists, skipping creation');
      applicationId = process.env.NLAPI_APPLICATION_ID;
    } else {
      applicationId = await createApplication(accessToken, developerId);
    }
    let apiKey;
    if (process.env.NLAPI_API_KEY) {
      console.log('API Key already exists, skipping creation');
      apiKey = process.env.NLAPI_API_KEY;
    } else {
      apiKey = await createApiKey(applicationId, accessToken);
    }

    console.log(`Save these to your .env file:
        NLAPI_APPLICATION_ID=${applicationId}
        NLAPI_API_KEY=${apiKey}`);
  } catch (error) {
    console.error('Error:', error);
  }
})();