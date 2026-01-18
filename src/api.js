import axios from 'axios';
import config from './config';

// Tạo instance axios với base URL
const api = axios.create({
  baseURL: config.TMDB_BASE_URL,
  params: {
    api_key: config.TMDB_API_KEY,
    language: config.LANGUAGE,
  },
});

// ================================
// API ENDPOINTS
// ================================

// Lấy danh sách phim đang thịnh hành (Trending)
export const getTrending = async () => {
  try {
    const response = await api.get('/trending/movie/week');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

// Lấy danh sách phim Top Rated
export const getTopRated = async () => {
  try {
    const response = await api.get('/movie/top_rated');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }
};

// Lấy danh sách phim theo thể loại
export const getMoviesByGenre = async (genreId) => {
  try {
    const response = await api.get('/discover/movie', {
      params: {
        with_genres: genreId,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreId}:`, error);
    return [];
  }
};

// ================================
// GENRE IDs
// ================================
export const GENRES = {
  ACTION: 28,
  COMEDY: 35,
  HORROR: 27,
  ROMANCE: 10749,
  DOCUMENTARY: 99,
  SCIENCE_FICTION: 878,
  THRILLER: 53,
  ANIMATION: 16,
};

// ================================
// HELPER FUNCTIONS
// ================================

// Lấy URL đầy đủ cho poster image
export const getPosterUrl = (posterPath) => {
  if (!posterPath) return null;
  return `${config.TMDB_IMAGE_BASE_URL}/${config.POSTER_SIZE}${posterPath}`;
};

// Lấy URL đầy đủ cho backdrop image
export const getBackdropUrl = (backdropPath) => {
  if (!backdropPath) return null;
  return `${config.TMDB_IMAGE_BASE_URL}/${config.BACKDROP_SIZE}${backdropPath}`;
};

// Truncate text với số ký tự tối đa
export const truncate = (str, maxLength) => {
  if (!str) return '';
  return str.length > maxLength ? str.substring(0, maxLength - 1) + '...' : str;
};

export default api;
