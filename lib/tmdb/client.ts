import { IMAGE_MAX_BYTES } from "@/lib/reviews/validation";
import { TmdbApiError } from "./errors";
import type {
  MovieDetail,
  MovieReview,
  NowPlayingMovie,
  TmdbCreditsResponse,
  TmdbImagesResponse,
  TmdbMovie,
  TmdbMovieDetailResponse,
  TmdbNowPlayingResponse,
  TmdbReviewsResponse,
  TmdbSearchResponse,
} from "./types";

const POSTER_IMAGE_WIDTH = "w342";
const POSTER_IMAGE_BASE_URL = `https://image.tmdb.org/t/p/${POSTER_IMAGE_WIDTH}`;
const BACKDROP_IMAGE_WIDTH = "w780";
const BACKDROP_IMAGE_BASE_URL = `https://image.tmdb.org/t/p/${BACKDROP_IMAGE_WIDTH}`;
const CAST_DISPLAY_LIMIT = 5;
const DIRECTOR_JOB = "Director";
const CAROUSEL_IMAGE_LIMIT = 8;
const REVIEW_DISPLAY_LIMIT = 5;

function getTmdbBaseUrl(): string {
  return process.env.TMDB_BASE_URL ?? "https://api.themoviedb.org/3";
}

function getTmdbAccessToken(): string {
  const token = process.env.TMDB_API_READ_ACCESS_TOKEN;
  if (!token) {
    throw new TmdbApiError("TMDB API 접근 토큰이 설정되지 않았습니다.");
  }
  return token;
}

function buildAuthHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${getTmdbAccessToken()}`,
    Accept: "application/json",
  };
}

export async function searchMovies(query: string): Promise<TmdbMovie[]> {
  const url = new URL(`${getTmdbBaseUrl()}/search/movie`);
  url.searchParams.set("query", query);
  url.searchParams.set("language", "ko-KR");

  const response = await fetch(url, { headers: buildAuthHeaders() });

  if (!response.ok) {
    throw new TmdbApiError(`TMDB 영화 검색에 실패했습니다. (status: ${response.status})`);
  }

  const body = (await response.json()) as TmdbSearchResponse;
  return body.results.map(toTmdbMovie);
}

function toTmdbMovie(raw: TmdbSearchResponse["results"][number]): TmdbMovie {
  return {
    id: raw.id,
    title: raw.title,
    releaseDate: raw.release_date,
    posterPath: raw.poster_path,
    posterUrl: raw.poster_path ? `${POSTER_IMAGE_BASE_URL}${raw.poster_path}` : null,
  };
}

export async function fetchNowPlayingMovies(): Promise<NowPlayingMovie[]> {
  const url = new URL(`${getTmdbBaseUrl()}/movie/now_playing`);
  url.searchParams.set("language", "ko-KR");
  url.searchParams.set("page", "1");

  const response = await fetch(url, { headers: buildAuthHeaders() });
  if (!response.ok) {
    throw new TmdbApiError(`상영중인 영화 목록을 불러오지 못했습니다. (status: ${response.status})`);
  }

  const body = (await response.json()) as TmdbNowPlayingResponse;
  return body.results.map(toNowPlayingMovie);
}

function toNowPlayingMovie(raw: TmdbNowPlayingResponse["results"][number]): NowPlayingMovie {
  return {
    id: raw.id,
    title: raw.title,
    posterUrl: raw.poster_path ? `${POSTER_IMAGE_BASE_URL}${raw.poster_path}` : null,
  };
}

export async function fetchMovieDetail(id: number): Promise<MovieDetail> {
  const detailUrl = new URL(`${getTmdbBaseUrl()}/movie/${id}`);
  detailUrl.searchParams.set("language", "ko-KR");
  const creditsUrl = new URL(`${getTmdbBaseUrl()}/movie/${id}/credits`);
  creditsUrl.searchParams.set("language", "ko-KR");
  const imagesUrl = new URL(`${getTmdbBaseUrl()}/movie/${id}/images`);
  const reviewsUrl = new URL(`${getTmdbBaseUrl()}/movie/${id}/reviews`);

  const [detailResponse, creditsResponse, imagesResponse, reviewsResponse] = await Promise.all([
    fetch(detailUrl, { headers: buildAuthHeaders() }),
    fetch(creditsUrl, { headers: buildAuthHeaders() }),
    fetch(imagesUrl, { headers: buildAuthHeaders() }),
    fetch(reviewsUrl, { headers: buildAuthHeaders() }),
  ]);

  if (!detailResponse.ok) {
    throw new TmdbApiError(`영화 상세정보를 불러오지 못했습니다. (status: ${detailResponse.status})`);
  }
  if (!creditsResponse.ok) {
    throw new TmdbApiError(`영화 크레딧 정보를 불러오지 못했습니다. (status: ${creditsResponse.status})`);
  }
  if (!imagesResponse.ok) {
    throw new TmdbApiError(`영화 이미지를 불러오지 못했습니다. (status: ${imagesResponse.status})`);
  }
  if (!reviewsResponse.ok) {
    throw new TmdbApiError(`영화 관람평을 불러오지 못했습니다. (status: ${reviewsResponse.status})`);
  }

  const detail = (await detailResponse.json()) as TmdbMovieDetailResponse;
  const credits = (await creditsResponse.json()) as TmdbCreditsResponse;
  const images = (await imagesResponse.json()) as TmdbImagesResponse;
  const reviews = (await reviewsResponse.json()) as TmdbReviewsResponse;

  return {
    id: detail.id,
    title: detail.title,
    overview: detail.overview,
    images: toCarouselImages(detail.poster_path, images),
    voteAverage: detail.vote_average,
    director: credits.crew.find((member) => member.job === DIRECTOR_JOB)?.name ?? null,
    cast: credits.cast.slice(0, CAST_DISPLAY_LIMIT).map((member) => member.name),
    reviews: toMovieReviews(reviews),
  };
}

function toCarouselImages(mainPosterPath: string | null, images: TmdbImagesResponse): string[] {
  const posterUrls = images.posters.map((poster) => `${POSTER_IMAGE_BASE_URL}${poster.file_path}`);
  const backdropUrls = images.backdrops.map((backdrop) => `${BACKDROP_IMAGE_BASE_URL}${backdrop.file_path}`);
  const mainPosterUrl = mainPosterPath ? `${POSTER_IMAGE_BASE_URL}${mainPosterPath}` : null;
  const orderedUrls = mainPosterUrl ? [mainPosterUrl, ...posterUrls, ...backdropUrls] : [...posterUrls, ...backdropUrls];
  return Array.from(new Set(orderedUrls)).slice(0, CAROUSEL_IMAGE_LIMIT);
}

function toMovieReviews(reviews: TmdbReviewsResponse): MovieReview[] {
  return reviews.results.slice(0, REVIEW_DISPLAY_LIMIT).map((review) => ({
    author: review.author,
    content: review.content,
  }));
}

export async function fetchPosterAsDataUrl(posterPath: string): Promise<string> {
  const response = await fetch(`${POSTER_IMAGE_BASE_URL}${posterPath}`);
  if (!response.ok) {
    throw new TmdbApiError(`포스터 이미지를 불러오지 못했습니다. (status: ${response.status})`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.byteLength > IMAGE_MAX_BYTES) {
    throw new TmdbApiError("이미지는 최대 10MB까지 등록할 수 있습니다.");
  }

  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  return `data:${contentType};base64,${buffer.toString("base64")}`;
}
