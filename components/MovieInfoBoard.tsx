"use client";

import { useEffect, useState } from "react";
import type { MovieDetail, NowPlayingMovie } from "@/lib/tmdb/types";
import MovieDetailModal from "./MovieDetailModal";

export default function MovieInfoBoard() {
  const [movies, setMovies] = useState<NowPlayingMovie[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    async function loadNowPlaying() {
      try {
        const response = await fetch("/api/tmdb/now-playing");
        const body = await response.json();
        if (!response.ok) {
          setErrorMessage(body.message ?? "상영중인 영화 목록을 불러오지 못했습니다.");
          return;
        }
        setMovies(body.movies as NowPlayingMovie[]);
      } catch {
        setErrorMessage("네트워크 오류로 상영중인 영화 목록을 불러오지 못했습니다.");
      }
    }
    loadNowPlaying();
  }, []);

  async function handlePosterClick(movie: NowPlayingMovie) {
    setIsLoadingDetail(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/tmdb/movies/${movie.id}`);
      const body = await response.json();
      if (!response.ok) {
        setErrorMessage(body.message ?? "영화 상세정보를 불러오지 못했습니다.");
        return;
      }
      setSelectedMovie(body as MovieDetail);
    } catch {
      setErrorMessage("네트워크 오류로 영화 상세정보를 불러오지 못했습니다.");
    } finally {
      setIsLoadingDetail(false);
    }
  }

  function handleCloseDetail() {
    setSelectedMovie(null);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <p className="text-sm text-zinc-500">개봉중인 영화</p>
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      <div className="flex flex-wrap gap-4">
        {movies.map((movie) => (
          <PosterButton key={movie.id} movie={movie} onClick={handlePosterClick} disabled={isLoadingDetail} />
        ))}
      </div>

      {selectedMovie ? <MovieDetailModal movie={selectedMovie} onClose={handleCloseDetail} /> : null}
    </div>
  );
}

interface PosterButtonProps {
  movie: NowPlayingMovie;
  onClick: (movie: NowPlayingMovie) => void;
  disabled: boolean;
}

function PosterButton({ movie, onClick, disabled }: PosterButtonProps) {
  function handleClick() {
    onClick(movie);
  }

  return (
    <button
      type="button"
      className="h-64 w-40 flex-shrink-0 overflow-hidden rounded border border-zinc-300 disabled:opacity-50"
      onClick={handleClick}
      disabled={disabled}
    >
      {movie.posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- TMDB 포스터 미리보기
        <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
          포스터 없음
        </span>
      )}
    </button>
  );
}
