import express from 'express';
import bodyParser from 'body-parser';
import HttpException from 'types/HttpException';

import moviesRoute from './routes/movie';

const app = express();

app.use(bodyParser.json());

app.get('/', (_req, res) => res.send('Express + TypeScript Server'));
app.use('/movies', moviesRoute);

app.use(
  (error: HttpException, _req: any, res: express.Response, _next: any) => {
    const message = error.message ?? 'Something went wrong';
    res.status(error.status).send(message);
  },
);

app.use(function (req, res, _next) {
  res.status(404);
  res.render('Not Found');
});

export default app;
