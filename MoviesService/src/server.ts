import express from 'express';
import bodyParser from 'body-parser';
import errorMiddleware from './middlewares/errorMiddleware';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import moviesRoute from './routes/movie';
import morganMiddleware from './middlewares/morganLogger';

const app = express();

app.use(bodyParser.json());

app.use(morganMiddleware);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(YAML.load(`swagger.yaml`)),
);

app.use('/movies', moviesRoute);

app.use(errorMiddleware);

app.use(function (req, res, _next) {
  res.status(404);
  res.render('Not Found');
});

export default app;
