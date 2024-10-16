// movie-app/src/services/moviedb.ts

import api from './apiV3'; // Ensure this is correctly configured with baseURL and headers
import fallbackMoviePoster from '../assets/images/failbackMovie.jpg';
import fallbackPersonImage from '../assets/images/failbackPerson.png';
import {
  Movie,
  SimilarMovie,
  Video,
  MovieVideosResponse,
  MovieList,
  GetMovieListsResponse,
  CastMember,
  CrewMember,
  PaginatedResponse,
  MovieCreditsResponse,
  PersonDetailsResponse,
  PersonMovieCreditsResponse,
  SearchMoviesResponse,
} from '../types/movie';
import { endpoints } from './endpoints';

// -------------------
// Utility Functions
// -------------------

// Constructs the full image URL with fallback
export const getImageUrl = (
  path: string | null,
  size: 'w500' | 'w342' | 'w185',
  isPerson: boolean = false
): string => {
  if (path) {
    return `https://image.tmdb.org/t/p/${size}${path}`;
  } else {
    return isPerson ? fallbackPersonImage : fallbackMoviePoster;
  }
};

// -------------------
// Generic API Call Function
// -------------------

// Generic API Call Function with AbortSignal and Enhanced Error Handling
export const apiCall = async <T>(
  endpoint: string,
  params?: Record<string, any>,
  signal?: AbortSignal
): Promise<T> => {
  try {
    const response = await api.get<T>(endpoint, { params, signal });
    return response.data;
  } catch (error: any) {
    console.error(`Failed to fetch data from ${endpoint}:`, error.message || error);
    throw new Error(`API call to ${endpoint} failed: ${error.message || error}`);
  }
};

// -------------------
// Specific API Call Functions
// -------------------

// Generalized Fetch for Paginated Responses
const fetchPaginatedMovies = async (endpoint: string): Promise<PaginatedResponse<Movie>> => {
  return apiCall<PaginatedResponse<Movie>>(endpoint);
};

// Fetch Trending Movies
export const fetchTrendingMovies = async (): Promise<PaginatedResponse<Movie>> => {
  return fetchPaginatedMovies(endpoints.trendingMovies);
};

// Fetch Upcoming Movies
export const fetchUpcomingMovies = async (): Promise<PaginatedResponse<Movie>> => {
  return fetchPaginatedMovies(endpoints.upcomingMovies);
};

// Fetch Top-Rated Movies
export const fetchTopRatedMovies = async (): Promise<PaginatedResponse<Movie>> => {
  return fetchPaginatedMovies(endpoints.topRatedMovies);
};

// Fetch Now-Playing Movies
export const fetchNowPlayingMovies = async (): Promise<PaginatedResponse<Movie>> => {
  return fetchPaginatedMovies(endpoints.nowPlayingMovies);
};

// Fetch Popular Movies
export const fetchPopularMovies = async (): Promise<PaginatedResponse<Movie>> => {
  return fetchPaginatedMovies(endpoints.popularMovies);
};

// Fetch Movie Details
export const fetchMovieDetails = async (id: number): Promise<Movie> => {
  return apiCall<Movie>(endpoints.movieDetails(id));
};

// Fetch Movie Credits
export const fetchMovieCredits = async (id: number): Promise<MovieCreditsResponse> => {
  return apiCall<MovieCreditsResponse>(endpoints.movieCredits(id));
};

// Fetch Similar Movies
export const fetchSimilarMovies = async (id: number): Promise<PaginatedResponse<SimilarMovie>> => {
  return apiCall<PaginatedResponse<SimilarMovie>>(endpoints.similarMovies(id));
};

// Fetch Movie Videos (Trailers)
export const fetchMovieVideos = async (id: number): Promise<MovieVideosResponse> => {
  return apiCall<MovieVideosResponse>(endpoints.movieVideos(id));
};

// Fetch Person Details
export const fetchPersonDetails = async (id: number): Promise<PersonDetailsResponse> => {
  return apiCall<PersonDetailsResponse>(endpoints.personDetails(id));
};

// Fetch Person's Movie Credits
export const fetchPersonMovieCredits = async (id: number): Promise<PersonMovieCreditsResponse> => {
  return apiCall<PersonMovieCreditsResponse>(endpoints.personMovieCredits(id));
};

// Search Movies
export const searchMovies = async (query: string, page: number = 1): Promise<SearchMoviesResponse> => {
  return apiCall<SearchMoviesResponse>(endpoints.searchMovies, { query, page });
};

// -------------------
// Export Fallback Images
// -------------------

export { fallbackMoviePoster, fallbackPersonImage };
