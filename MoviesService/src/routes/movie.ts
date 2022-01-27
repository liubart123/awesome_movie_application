import { Router } from 'express';

import MovieController from '../controllers/MovieController';
import AuthController from '../controllers/AuthController';

const router = Router();

router.post(
  '/',
  AuthController.requireUserRole('basic', 'premium'),
  MovieController.createMovie,
);
router.get(
  '/',
  AuthController.requireUserRole('basic', 'premium'),
  MovieController.getAllUsersMovies,
);

export default router;
