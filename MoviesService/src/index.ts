import config from './utils/config';
import server from './server';
import postgresStart from './db/bootstrap';
import logger from './utils/logger';

postgresStart()
  .then(() => {
    console.log('postgres is working...');
  })
  .catch(console.error);

server.listen(config.MOVIES_PORT, () => {
  logger.info(
    `⚡️[server]: Server is running at https://localhost:${config.MOVIES_PORT}`,
  );
});
