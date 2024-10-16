/**
 * Genre Interface
 */
export interface Genre {
  id: number;
  name: string;
}

/**
 * Media Type Enum
 */
export enum MediaType {
  Movie = "movie",
  TV = "tv",
  // 추가 필요한 타입...
}

/**
 * Movie Interface
 */
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  runtime?: number; // 선택적으로 정의
  status: string;
  genres: Genre[];
  vote_average?: number; // TMDB API에 맞게 변경
}

/**
 * Base Movie Interface (for items like SimilarMovie, MovieItem, etc.)
 */
export interface BaseMovie {
  id: number;
  title: string;
  poster_path: string | null;
}

export type MovieItem = BaseMovie;
export type SimilarMovie = BaseMovie;

/**
 * Gender Enum
 */
export enum Gender {
  Unknown = 0,
  Female = 1,
  Male = 2,
}

/**
 * Person Interface (Common for Cast and Crew)
 */
interface Person {
  credit_id: string;
  gender: Gender | null;
  id: number;
  name: string;
  profile_path: string | null;
}

/**
 * Cast Member Interface
 */
export interface CastMember extends Person {
  cast_id: number;
  character: string;
  order: number;
}

/**
 * Crew Member Interface
 */
export interface CrewMember extends Person {
  department: string;
  job: string;
}

/**
 * Movie Credits Response Interface
 */
export interface MovieCreditsResponse {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

/**
 * Paginated Response Interface
 */
export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/**
 * Video Type Enum
 */
export enum VideoType {
  Trailer = "Trailer",
  Teaser = "Teaser",
  Clip = "Clip",
  Featurette = "Featurette",
  BehindTheScenes = "Behind the Scenes",
  // 추가 필요한 타입...
}

/**
 * Video Interface
 */
export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: VideoType;
  official: boolean;
  published_at: string; // 필요 시 Date로 변환하여 사용
}

/**
 * Movie Videos Response Interface
 */
export interface MovieVideosResponse {
  id: number;
  results: Video[];
}

/**
 * Movie List Interface
 */
export interface MovieList {
  id: number;
  name: string;
  description: string;
  favorite_count: number;
  item_count: number;
  iso_639_1: string;
  list_type: MediaType; // 변경된 부분: ListType 제거
  description_plain?: string; // 선택적으로 정의
}

/**
 * Get Movie Lists Response Interface
 */
export interface GetMovieListsResponse extends PaginatedResponse<MovieList> {}

/**
 * List Item Interface
 */
export interface ListItem {
  media_type: MediaType;
  media_id: number;
  // 필요 시 추가 필드
}

/**
 * List Interface
 */
export interface List {
  id: number;
  name: string;
  description: string;
  public: boolean;
  sort_by: string;
  iso_639_1: string;
  iso_3166_1: string;
  created_at: string;
  updated_at: string;
  results: Movie[];
}

/**
 * Create List Response Interface
 */
export interface CreateListResponse {
  id: number;
  name: string;
  description: string;
  public: boolean;
  show_comments: boolean;
  sort_by: string;
  created_at: string; // 필수로 변경
  updated_at: string; // 필수로 변경
}

/**
 * Add Item to List Response Interface
 */
export interface AddItemToListResponse {
  success: boolean;
  status_code: number;
  status_message: string;
}

export interface RatedMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}