import { Request, Response, NextFunction } from 'express';
import MovieService from '../services/MovieService';
import HttpException from '../types/HttpException';

const MovieController = {
  createMovie: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new HttpException(401));
      return;
    }

    if (!req.body || !req.body.title) {
      next(new HttpException(400, `invalid object was sended`));
      return;
    }

    const detailedMovie = await MovieService.fetchAdditionalMovieDetails(
      req.body?.title,
    );
    if (!detailedMovie) {
      next(new HttpException(404, 'movie with this title was not found'));
      return;
    }

    if (req.user.role === 'basic') {
      const usersMovies = await MovieService.getMoviesAddedThisMonth(
        req.user?.userId,
      );
      if (usersMovies.length >= 5) {
        next(new HttpException(403, 'you can create olny 5 movies per month'));
        return;
      }
    }
    const createdMovie = await MovieService.insertMovie({
      userId: req.user.userId,
      ...detailedMovie,
      id: undefined,
      created: undefined,
    });
    res.status(201).json(createdMovie);
  },
  getAllUsersMovies: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      next(new HttpException(401));
      return;
    }
    const movies = await MovieService.getMovies(req.user?.userId);
    res.json(movies);
  },
};

export default MovieController;
