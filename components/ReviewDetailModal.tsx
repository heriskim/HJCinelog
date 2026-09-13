"use client";

import { useState } from "react";
import type { Review } from "@/lib/reviews/types";
import ReviewFormModal from "./ReviewFormModal";
import StarRating from "./StarRating";

interface ReviewDetailModalProps {
  review: Review;
  onClose: () => void;
  onSaved: (review: Review) => void;
}

export default function ReviewDetailModal({ review, onClose, onSaved }: ReviewDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  function handleEditClick() {
    setIsEditing(true);
  }

  function handleSaved(saved: Review) {
    setIsEditing(false);
    onSaved(saved);
  }

  if (isEditing) {
    return <ReviewFormModal mode="edit" initialData={review} onClose={onClose} onSaved={handleSaved} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">{review.title}</h2>
          <StarRating value={review.rating} readOnly />
        </div>
        <div className="mb-4 flex gap-4">
          <div className="h-64 w-40 flex-shrink-0 overflow-hidden rounded border border-zinc-200">
            {review.image ? (
              // eslint-disable-next-line @next/next/no-img-element -- 저장된 이미지 미리보기
              <img src={review.image} alt={review.title} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
                감상평 이미지
              </span>
            )}
          </div>
          <p className="h-64 flex-1 overflow-y-auto whitespace-pre-wrap rounded border border-zinc-200 p-3">
            {review.review}
          </p>
        </div>
        <p className="mb-4 rounded border border-zinc-200 px-3 py-2 text-zinc-700">{review.oneLiner}</p>
        <div className="flex justify-end gap-2">
          <button type="button" className="rounded border border-zinc-300 px-4 py-2" onClick={onClose}>
            닫기
          </button>
          <button type="button" className="rounded bg-zinc-900 px-4 py-2 text-white" onClick={handleEditClick}>
            편집하기
          </button>
        </div>
      </div>
    </div>
  );
}
