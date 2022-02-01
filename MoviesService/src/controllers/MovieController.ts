import HttpStatuses from '../constants/HttpStatuses';
import { Request, Response, NextFunction } from 'express';
import MovieService from '../services/MovieService';
import HttpException from '../types/HttpException';
import OmdbService from '../services/OmdbService';

const MovieController = {
  createMovie: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new HttpException(HttpStatuses.UNAUTHORIZED));
      return;
    }

    const detailedMovie = await OmdbService.fetchAdditionalMovieDetails(
      req.body?.title,
    );
    if (!detailedMovie) {
      next(
        new HttpException(
          HttpStatuses.NOT_FOUND,
          'movie with this title was not found',
        ),
      );
      return;
    }

    if (req.user.role === 'basic') {
      const usersMovies = await MovieService.getMoviesAddedThisMonth(
        req.user?.userId,
      );
      if (usersMovies.length >= 5) {
        next(
          new HttpException(
            HttpStatuses.FORBIDDEN,
            'you can create olny 5 movies per month',
          ),
        );
        return;
      }
    }
    MovieService.insertMovie({
      userId: req.user.userId,
      ...detailedMovie,
      id: undefined,
      created: undefined,
    })
      .then((createdMovie) => {
        res.status(HttpStatuses.CREATED).json(createdMovie);
      })
      .catch((error) => {
        next(error);
      });
  },
  getAllUsersMovies: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      next(new HttpException(HttpStatuses.UNAUTHORIZED));
      return;
    }
    const movies = await MovieService.getMovies(req.user?.userId);
    res.json(movies);
  },
  getMovie: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id || Number.isInteger(req.params.id)) {
      next(
        new HttpException(
          HttpStatuses.BAD_REQUEST,
          'Request must contain movie id',
        ),
      );
      return;
    }
    const movie = await MovieService.getMovie(Number.parseInt(req.params.id));
    if (!movie) {
      next(
        new HttpException(
          HttpStatuses.NOT_FOUND,
          'Movie with such id doesn`t exist',
        ),
      );
      return;
    }
    res.json(movie);
  },
};

export default MovieController;
