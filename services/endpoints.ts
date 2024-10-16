// movie-app/services/endpoints.ts

export const endpoints = {
  trendingMovies: '/trending/movie/day',
  upcomingMovies: '/movie/upcoming',
  topRatedMovies: '/movie/top_rated',
  nowPlayingMovies: '/movie/now_playing',
  popularMovies: '/movie/popular',
  movieDetails: (id: number) => `/movie/${id}`,
  movieCredits: (id: number) => `/movie/${id}/credits`,
  similarMovies: (id: number) => `/movie/${id}/similar`,
  movieVideos: (id: number) => `/movie/${id}/videos`,
  personDetails: (id: number) => `/person/${id}`,
  personMovieCredits: (id: number) => `/person/${id}/movie_credits`,
  addMovieToList: (listId: number) => `/list/${listId}/add_item`,
  getMovieLists: (movieId: number) => `/movie/${movieId}/lists`,
  getUserLists: (accountId: number) => `/account/${accountId}/lists`,
  searchMovies: '/search/movie',
};
