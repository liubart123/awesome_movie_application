import { Router } from 'express';

import MovieController from '../controllers/MovieController';
import authMiddleware from '../middlewares/authMiddleware';
import validationMiddleware from '../middlewares/validationMiddleware';
import { CreateMovieDto } from '../dto/Movie.dto';

const router = Router();

router.post(
  '/',
  authMiddleware.requireUserRole('basic', 'premium'),
  validationMiddleware(CreateMovieDto),
  MovieController.createMovie,
);
router.get(
  '/',
  authMiddleware.requireUserRole('basic', 'premium'),
  MovieController.getAllUsersMovies,
);
router.get(
  '/:id(\\d+)',
  authMiddleware.requireUserRole('basic', 'premium'),
  MovieController.getMovie,
);

export default router;
