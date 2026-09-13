"use client";

import { useRef, useState } from "react";
import { IMAGE_MAX_BYTES } from "@/lib/reviews/validation";
import type { Review, ReviewInput } from "@/lib/reviews/types";
import AlertDialog from "./AlertDialog";
import PosterSearchModal from "./PosterSearchModal";
import PosterSourceModal from "./PosterSourceModal";
import StarRating from "./StarRating";

interface ReviewFormModalProps {
  mode: "create" | "edit";
  initialData?: Review;
  onClose: () => void;
  onSaved: (review: Review) => void;
}

type PosterModalState = "none" | "source" | "search";

export default function ReviewFormModal({ mode, initialData, onClose, onSaved }: ReviewFormModalProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [rating, setRating] = useState(initialData?.rating ?? 5);
  const [reviewText, setReviewText] = useState(initialData?.review ?? "");
  const [oneLiner, setOneLiner] = useState(initialData?.oneLiner ?? "");
  const [image, setImage] = useState(initialData?.image);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [posterModalState, setPosterModalState] = useState<PosterModalState>("none");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleReviewChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setReviewText(event.target.value);
  }

  function handleOneLinerChange(event: React.ChangeEvent<HTMLInputElement>) {
    setOneLiner(event.target.value);
  }

  function handlePosterFrameClick() {
    setPosterModalState("source");
  }

  function handleSelectLocalSource() {
    setPosterModalState("none");
    fileInputRef.current?.click();
  }

  function handleSelectApiSource() {
    setPosterModalState("search");
  }

  function handlePosterModalCancel() {
    setPosterModalState("none");
  }

  function handlePosterSearchError(message: string) {
    setPosterModalState("none");
    setAlertMessage(message);
  }

  function handlePosterSearchConfirm(imageDataUrl: string) {
    setImage(imageDataUrl);
    setPosterModalState("none");
  }

  async function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    if (file.size > IMAGE_MAX_BYTES) {
      setAlertMessage("이미지는 최대 10MB까지 등록할 수 있습니다.");
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    setImage(dataUrl);
  }

  function handleAlertClose() {
    setAlertMessage(null);
  }

  async function handleSave() {
    setIsSaving(true);
    setErrorMessage(null);
    const input: ReviewInput = { title, rating, review: reviewText, oneLiner, image };
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
        <div className="mb-4 flex gap-4">
          <button
            type="button"
            className="h-64 w-40 flex-shrink-0 overflow-hidden rounded border border-zinc-300"
            onClick={handlePosterFrameClick}
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element -- 로컬/외부에서 불러온 이미지 미리보기
              <img src={image} alt="감상평 이미지" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
                감상평 이미지
                <br />
                (클릭하여 등록)
              </span>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />
          <textarea
            className="h-64 flex-1 resize-none rounded border border-zinc-300 p-3"
            placeholder="감상평"
            value={reviewText}
            maxLength={2000}
            onChange={handleReviewChange}
          />
        </div>
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

      {posterModalState === "source" ? (
        <PosterSourceModal
          onSelectLocal={handleSelectLocalSource}
          onSelectApi={handleSelectApiSource}
          onCancel={handlePosterModalCancel}
        />
      ) : null}

      {posterModalState === "search" ? (
        <PosterSearchModal
          onConfirm={handlePosterSearchConfirm}
          onCancel={handlePosterModalCancel}
          onError={handlePosterSearchError}
        />
      ) : null}

      {alertMessage ? <AlertDialog message={alertMessage} onClose={handleAlertClose} /> : null}
    </div>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
