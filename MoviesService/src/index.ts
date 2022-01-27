import config from './utils/config';
import server from './server';
import postgresStart from './db/bootstrap';

postgresStart()
  .then(() => {
    console.log('postgres is working...');
  })
  .catch(console.error);

server.listen(config.MOVIES_PORT, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${config.MOVIES_PORT}`,
  );
});
