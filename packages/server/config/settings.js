// Load environment variables from the appropriate .env file
const dotenv = require("dotenv");
const env = process.env.NODE_ENV || "development";
const path = require("path");

// Determine the correct .env file to load
const envFile =
  env === "production"
    ? path.resolve(__dirname, "../../../.env.production")
    : path.resolve(__dirname, "../../../.env");

// Load the environment variables
dotenv.config({ path: envFile });

const envConfigs = {
  development: {
    NGROK_URL: "https://quick-notable-duck.ngrok-free.app",
    FRONTEND_URL: "https://quick-notable-duck.ngrok-free.app",
    DB_NAME: "rfk_central",
    DB_USER: "postgres",
    DB_HOST: "localhost",
    DB_PORT: 5544,
    // NLAPI_APPLICATION_ID: "52",
  },
  production: {
    NGROK_URL: "https://hubspot-slack-963655346691.us-central1.run.app",
    FRONTEND_URL: "https://hubspot-slack-16c7c.web.app",
    DB_NAME: "rfk_central",
    DB_USER: "neondb_owner",
    DB_HOST: "ep-jolly-snow-a5nqmjjm.us-east-2.aws.neon.tech",
    DB_PORT: 5432,
    // NLAPI_APPLICATION_ID: "53",
  },
};

const nonSensitiveSettings = {
  DB_DIALECT: "postgres",
};

// Sensitive values from environment variables
const sensitiveSettings = {
  DB_PASSWORD: process.env.DB_PASSWORD,
  SERVER_SESSION_SECRET: process.env.SERVER_SESSION_SECRET,
  // NLAPI_DEV_USER: process.env.NLAPI_DEV_USER,
  // NLAPI_DEV_PASSWORD: process.env.NLAPI_DEV_PASSWORD,
  // NLAPI_API_KEY: process.env.NLAPI_API_KEY,
};

// Combine environment-specific config with sensitive settings
const settings = {
  ENV: env,
  ...envConfigs[env],
  ...nonSensitiveSettings,
  ...sensitiveSettings,
};

module.exports = settings;
