import Movie from '../db/entities/Movie';
import { getRepository, Between } from 'typeorm';
import HttpException from '../types/HttpException';
import HttpStatuses from '../constants/HttpStatuses';

const MovieService = {
  insertMovie: async (movie: Movie) => {
    const movieRepository = getRepository(Movie);
    const existedMovie = await movieRepository.findOne({
      where: { title: movie.title, userId: movie.userId },
    });
    if (existedMovie) {
      throw new HttpException(
        HttpStatuses.FORBIDDEN,
        'Movie with such title has been already created by this user',
      );
    }
    const createdMovie = await movieRepository.save(movie);
    return createdMovie;
  },
  getMovies: async (userId: number) => {
    const movieRepository = getRepository(Movie);
    const movies = await movieRepository.find({ where: { userId } });
    return movies;
  },
  getMovie: async (movieId: number) => {
    const movieRepository = getRepository(Movie);
    const movie = await movieRepository.findOne({ where: { id: movieId } });
    return movie;
  },

  getMoviesAddedThisMonth: async (userId: number) => {
    const movieRepository = getRepository(Movie);
    const currentDate = new Date();
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
      0,
      0,
      0,
    );
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
    );
    const movies = await movieRepository.find({
      where: { userId, created: Between(firstDay, lastDay) },
    });
    return movies;
  },
};

export default MovieService;
