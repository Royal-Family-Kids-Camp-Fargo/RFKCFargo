export const settings = {
  tenantId: import.meta.env.PROD ? "10141" : "10250",
  apiUrl: "https://api.devii.io",
  classes: {
    userClassId: "10179",
    adminClassId: "10178",
    superAdminClassId: "10181",
  },
  nlapi: {
    apiKey: import.meta.env.VITE_NLAPI_API_KEY,
  },
  db: {
    host: import.meta.env.VITE_DB_HOST,
    name: import.meta.env.PROD ? "rfk_central" : "rfk_central_dev",
  },
};
