"use client";

import { useState } from "react";
import type { Review, ReviewInput } from "@/lib/reviews/types";
import StarRating from "./StarRating";

interface ReviewFormModalProps {
  mode: "create" | "edit";
  initialData?: Review;
  onClose: () => void;
  onSaved: (review: Review) => void;
}

export default function ReviewFormModal({ mode, initialData, onClose, onSaved }: ReviewFormModalProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [rating, setRating] = useState(initialData?.rating ?? 5);
  const [reviewText, setReviewText] = useState(initialData?.review ?? "");
  const [oneLiner, setOneLiner] = useState(initialData?.oneLiner ?? "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleReviewChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setReviewText(event.target.value);
  }

  function handleOneLinerChange(event: React.ChangeEvent<HTMLInputElement>) {
    setOneLiner(event.target.value);
  }

  async function handleSave() {
    setIsSaving(true);
    setErrorMessage(null);
    const input: ReviewInput = { title, rating, review: reviewText, oneLiner };
    try {
      const endpoint = mode === "create" ? "/api/reviews" : `/api/reviews/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const body = await response.json();
      if (!response.ok) {
        setErrorMessage(body.message ?? "저장에 실패했습니다.");
        return;
      }
      onSaved(body as Review);
    } catch {
      setErrorMessage("네트워크 오류로 저장하지 못했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <input
            className="flex-1 rounded border border-zinc-300 px-3 py-2 text-lg font-semibold"
            placeholder="영화 제목"
            value={title}
            maxLength={30}
            onChange={handleTitleChange}
          />
          <StarRating value={rating} onChange={setRating} />
        </div>
        <textarea
          className="mb-4 h-64 w-full resize-none rounded border border-zinc-300 p-3"
          placeholder="감상평"
          value={reviewText}
          maxLength={2000}
          onChange={handleReviewChange}
        />
        <input
          className="mb-4 w-full rounded border border-zinc-300 px-3 py-2"
          placeholder="한줄평"
          value={oneLiner}
          maxLength={100}
          onChange={handleOneLinerChange}
        />
        {errorMessage ? <p className="mb-4 text-sm text-red-600">{errorMessage}</p> : null}
        <div className="flex justify-end gap-2">
          <button type="button" className="rounded border border-zinc-300 px-4 py-2" onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
            onClick={handleSave}
            disabled={isSaving}
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
