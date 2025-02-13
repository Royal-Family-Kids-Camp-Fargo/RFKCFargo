/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEVII_TENANT_ID: number;
  readonly VITE_DEVII_BASE_URL: string;
  readonly VITE_NLAPI_BASE_URL: string;
  readonly VITE_NLAPI_API_KEY: string;
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
