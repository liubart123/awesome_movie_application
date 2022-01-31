import { Router } from 'express';

import MovieController from '../controllers/MovieController';
import AuthController from '../controllers/AuthController';
import validationMiddleware from '../middlewares/validationMiddleware';
import { CreateMovieDto } from '../dto/Movie.dto';

const router = Router();

router.post(
  '/',
  AuthController.requireUserRole('basic', 'premium'),
  validationMiddleware(CreateMovieDto),
  MovieController.createMovie,
);
router.get(
  '/',
  AuthController.requireUserRole('basic', 'premium'),
  MovieController.getAllUsersMovies,
);

export default router;
