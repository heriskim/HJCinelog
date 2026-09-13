"use client";

import { useState } from "react";
import type { TmdbMovie } from "@/lib/tmdb/types";

interface PosterSearchModalProps {
  onConfirm: (imageDataUrl: string) => void;
  onCancel: () => void;
  onError: (message: string) => void;
}

export default function PosterSearchModal({ onConfirm, onCancel, onError }: PosterSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbMovie[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingPoster, setIsLoadingPoster] = useState(false);

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  async function handleSearch(searchQuery: string) {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(`/api/tmdb/search?query=${encodeURIComponent(trimmed)}`);
      const body = await response.json();
      if (!response.ok) {
        onError(body.message ?? "영화 검색에 실패했습니다.");
        return;
      }
      setResults(body.results as TmdbMovie[]);
      setSelectedId(null);
    } catch {
      onError("네트워크 오류로 영화를 검색하지 못했습니다.");
    } finally {
      setIsSearching(false);
    }
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleSearch(query);
  }

  function toggleSelect(movie: TmdbMovie) {
    if (!movie.posterUrl) {
      return;
    }
    setSelectedId((current) => (current === movie.id ? null : movie.id));
  }

  async function handleConfirmClick() {
    const movie = results.find((item) => item.id === selectedId);
    if (!movie?.posterPath) {
      return;
    }
    setIsLoadingPoster(true);
    try {
      const response = await fetch(`/api/tmdb/poster?path=${encodeURIComponent(movie.posterPath)}`);
      const body = await response.json();
      if (!response.ok) {
        onError(body.message ?? "포스터 이미지를 불러오지 못했습니다.");
        return;
      }
      onConfirm(body.image as string);
    } catch {
      onError("네트워크 오류로 포스터 이미지를 불러오지 못했습니다.");
    } finally {
      setIsLoadingPoster(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <form className="mb-4 flex gap-2" onSubmit={handleSearchSubmit}>
          <input
            className="flex-1 rounded border border-zinc-300 px-3 py-2"
            placeholder="영화 제목으로 검색"
            value={query}
            onChange={handleQueryChange}
          />
          <button
            type="submit"
            className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
            disabled={isSearching}
          >
            검색
          </button>
        </form>

        <div className="mb-4 grid max-h-96 grid-cols-3 gap-3 overflow-y-auto">
          {results.map((movie) => (
            <PosterResultCard
              key={movie.id}
              movie={movie}
              isSelected={movie.id === selectedId}
              onToggle={toggleSelect}
            />
          ))}
          {results.length === 0 ? (
            <p className="col-span-3 py-8 text-center text-zinc-400">검색 결과가 없습니다.</p>
          ) : null}
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" className="rounded border border-zinc-300 px-4 py-2" onClick={onCancel}>
            취소
          </button>
          <button
            type="button"
            className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
            onClick={handleConfirmClick}
            disabled={selectedId === null || isLoadingPoster}
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
}

interface PosterResultCardProps {
  movie: TmdbMovie;
  isSelected: boolean;
  onToggle: (movie: TmdbMovie) => void;
}

function PosterResultCard({ movie, isSelected, onToggle }: PosterResultCardProps) {
  function handleToggleClick() {
    onToggle(movie);
  }

  return (
    <button
      type="button"
      className={`flex flex-col gap-1 rounded border p-2 text-left ${
        isSelected ? "border-zinc-900" : "border-zinc-200"
      }`}
      onClick={handleToggleClick}
      disabled={!movie.posterUrl}
    >
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={isSelected} readOnly />
        <span className="text-xs text-zinc-500">포스터 검색 결과</span>
      </div>
      {movie.posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- 외부 TMDB 이미지 미리보기
        <img src={movie.posterUrl} alt={movie.title} className="h-40 w-full rounded object-cover" />
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded bg-zinc-100 text-xs text-zinc-400">
          포스터 없음
        </div>
      )}
      <p className="truncate text-sm">{movie.title}</p>
    </button>
  );
}
