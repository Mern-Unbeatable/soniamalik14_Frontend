const requiredEnvVars = {
  VITE_API_BASE_URL: 'API base URL',
  VITE_APP_NAME: 'Application name',
};

// Debug: Log all VITE_ environment variables
// eslint-disable-next-line no-console
console.log(
  '[env] All VITE_ variables:',
  Object.keys(import.meta.env)
    .filter((k) => k.startsWith('VITE_'))
    .reduce((acc, k) => ({ ...acc, [k]: import.meta.env[k] }), {})
);

Object.entries(requiredEnvVars).forEach(([key, label]) => {
  if (!import.meta.env[key]) {
    // eslint-disable-next-line no-console
    console.error(`[env] Missing required: ${key} (${label})`);
    throw new Error(`Missing required environment variable: ${key} (${label})`);
  }
});

export const ENV = Object.freeze({
  MODE: import.meta.env.MODE,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,

  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
});
