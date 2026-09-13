"use client";

import { useState } from "react";
import type { MovieDetail } from "@/lib/tmdb/types";

interface MovieDetailModalProps {
  movie: MovieDetail;
  onClose: () => void;
}

export default function MovieDetailModal({ movie, onClose }: MovieDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">{movie.title}</h2>
          <span className="text-sm text-zinc-600">관람평점 {movie.voteAverage.toFixed(1)}</span>
        </div>
        <div className="mb-4 flex gap-4">
          <ImageCarousel images={movie.images} title={movie.title} />
          <div className="h-64 flex-1 overflow-y-auto rounded border border-zinc-200 p-3 text-sm">
            <p className="mb-3 whitespace-pre-wrap">{movie.overview || "줄거리 정보가 없습니다."}</p>
            <p className="mb-1 text-zinc-600">감독: {movie.director ?? "정보 없음"}</p>
            <p className="text-zinc-600">
              출연: {movie.cast.length > 0 ? movie.cast.join(", ") : "정보 없음"}
            </p>
          </div>
        </div>

        <ReviewList reviews={movie.reviews} />

        <div className="flex justify-end">
          <button type="button" className="rounded border border-zinc-300 px-4 py-2" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

interface ImageCarouselProps {
  images: string[];
  title: string;
}

function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  function handlePrevClick() {
    setCurrentIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  }

  function handleNextClick() {
    setCurrentIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  }

  if (images.length === 0) {
    return (
      <div className="flex h-64 w-40 flex-shrink-0 items-center justify-center rounded border border-zinc-200 text-sm text-zinc-400">
        이미지 없음
      </div>
    );
  }

  return (
    <div className="relative h-64 w-40 flex-shrink-0 overflow-hidden rounded border border-zinc-200">
      {/* eslint-disable-next-line @next/next/no-img-element -- TMDB 캐러셀 이미지 미리보기 */}
      <img src={images[currentIndex]} alt={title} className="h-full w-full object-cover" />
      {images.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="이전 이미지"
            className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-2 py-1 text-xs text-white"
            onClick={handlePrevClick}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="다음 이미지"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-2 py-1 text-xs text-white"
            onClick={handleNextClick}
          >
            ›
          </button>
          <span className="absolute bottom-1 right-1 rounded bg-black/50 px-2 py-0.5 text-xs text-white">
            {currentIndex + 1} / {images.length}
          </span>
        </>
      ) : null}
    </div>
  );
}

interface ReviewListProps {
  reviews: MovieDetail["reviews"];
}

function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-sm font-medium text-zinc-700">관람평</p>
      <div className="max-h-40 overflow-y-auto rounded border border-zinc-200 p-3 text-sm">
        {reviews.length === 0 ? (
          <p className="text-zinc-400">등록된 관람평이 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {reviews.map((review, index) => (
              <li key={`${review.author}-${index}`}>
                <p className="mb-1 font-medium text-zinc-700">{review.author}</p>
                <p className="whitespace-pre-wrap text-zinc-600">{review.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
