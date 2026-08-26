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
        <p className="mb-4 h-64 w-full overflow-y-auto whitespace-pre-wrap rounded border border-zinc-200 p-3">
          {review.review}
        </p>
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
