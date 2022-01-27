const getNumericValue = (
  envValue: string | undefined,
  defaultValue: number,
) => {
  return Number.isInteger(envValue) ? Number(envValue) : defaultValue;
};

export default {
  MOVIES_PORT: getNumericValue(process.env.MOVIES_PORT, 8800),
  MOVIES_DB_PORT: getNumericValue(process.env.MOVIES_DB_PORT, 5432),
  MOVIES_DB_DATABASE: process.env.MOVIES_DB_DATABASE ?? 'movies',
  MOVIES_DB_USERNAME: process.env.MOVIES_DB_USERNAME ?? 'movies_admin',
  MOVIES_DB_PASSWORD: process.env.MOVIES_DB_PASSWORD ?? 'pass123',
  MOVIES_DB_HOST: process.env.MOVIES_DB_HOST ?? '127.0.0.1',
  JWT_SECRET: process.env.JWT_SECRET ?? 'my awesome secret',
  OMDB_URL: process.env.OMDB_URL ?? 'https://omdbapi.com',
  OMDB_KEY: process.env.OMDB_KEY ?? 'e97855c7',
  AUTH_HOST: process.env.AUTH_HOST ?? '127.0.0.1',
  AUTH_PORT: getNumericValue(process.env.AUTH_PORT, 3001),
};
