import axios from 'axios';
import config from '../utils/config';

const OmdbService = {
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
};

export default OmdbService;
