import { ConnectionOptions } from 'typeorm';
import config from '../utils/config';
export default {
  name: 'default',
  type: 'postgres',
  host: config.MOVIES_DB_HOST,
  username: config.MOVIES_DB_USERNAME,
  password: config.MOVIES_DB_PASSWORD,
  database: config.MOVIES_DB_DATABASE,
  port: config.MOVIES_DB_PORT,
  entities: [`${__dirname}/entities/*.{ts,js}`],
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  cli: {
    entitiesDir: 'src/db/entities',
    migrationsDir: 'src/db/migrations',
  },
  logger: 'simple-console',
} as ConnectionOptions;
