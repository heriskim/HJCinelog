export interface TmdbMovie {
  id: number;
  title: string;
  releaseDate: string;
  posterPath: string | null;
  posterUrl: string | null;
}

export interface TmdbSearchResponse {
  results: Array<{
    id: number;
    title: string;
    release_date: string;
    poster_path: string | null;
  }>;
}

export interface NowPlayingMovie {
  id: number;
  title: string;
  posterUrl: string | null;
}

export interface MovieReview {
  author: string;
  content: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  images: string[];
  voteAverage: number;
  director: string | null;
  cast: string[];
  reviews: MovieReview[];
}

export interface TmdbNowPlayingResponse {
  results: Array<{
    id: number;
    title: string;
    poster_path: string | null;
  }>;
}

export interface TmdbMovieDetailResponse {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
}

export interface TmdbCreditsResponse {
  cast: Array<{ name: string }>;
  crew: Array<{ name: string; job: string }>;
}

export interface TmdbImagesResponse {
  posters: Array<{ file_path: string }>;
  backdrops: Array<{ file_path: string }>;
}

export interface TmdbReviewsResponse {
  results: Array<{ author: string; content: string }>;
}
