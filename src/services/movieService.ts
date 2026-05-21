import axios from 'axios';
import type { Movie } from '../types/movie';
axios.defaults.baseURL = 'https://api.themoviedb.org/3/';
axios.defaults.headers.Authorization = `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`;

interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async (
  query: string,
  page: number,
): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(`search/movie`, {
    params: {
      query: query,
      page: page,
      include_adult: false,
      language: 'en-US',
    },
  });
  console.log(response.data);
  return response.data;
};
