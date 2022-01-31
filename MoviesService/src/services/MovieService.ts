import Movie from '../db/entities/Movie';
import { getRepository, Between } from 'typeorm';
import axios from 'axios';
import config from '../utils/config';

const MovieService = {
  insertMovie: async (movie: Movie) => {
    const movieRepository = getRepository(Movie);
    const createdMovie = await movieRepository.save(movie);
    return createdMovie;
  },
  getMovies: async (userId: number) => {
    const movieRepository = getRepository(Movie);
    const movies = await movieRepository.find({ where: { userId } });
    return movies;
  },
  fetchAdditionalMovieDetails: async (title: string) => {
    const response = await axios.get(config.OMDB_URL, {
      params: {
        apikey: config.OMDB_KEY,
        t: title,
      },
    });

    if (!response || !response.data || response.data.Response === 'False') {
      return;
    }
    const { Title, Genre, Director, Released } = response.data;
    return {
      title: (Title as string) || '',
      genre: (Genre as string) || '',
      director: (Director as string) || '',
      released: new Date(Released),
    };
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
