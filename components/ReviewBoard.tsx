"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { AuthenticatedUser } from "@/lib/auth/session";
import type { Review } from "@/lib/reviews/types";
import ConfirmDialog from "./ConfirmDialog";
import Pagination from "./Pagination";
import ReviewDetailModal from "./ReviewDetailModal";
import ReviewFormModal from "./ReviewFormModal";
import ReviewGrid from "./ReviewGrid";

const PAGE_SIZE = 20;

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "detail"; review: Review }
  | { type: "edit"; review: Review }
  | { type: "delete"; review: Review };

interface ReviewBoardProps {
  user: AuthenticatedUser | null;
}

export default function ReviewBoard({ user }: ReviewBoardProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [titleQuery, setTitleQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [modalState, setModalState] = useState<ModalState>({ type: "none" });
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReviews = useCallback(async function fetchReviews(
    searchTitle: string,
    searchDate: string,
    targetPage: number
  ) {
    const params = new URLSearchParams({ page: String(targetPage) });
    if (searchTitle) {
      params.set("title", searchTitle);
    }
    if (searchDate) {
      params.set("date", searchDate);
    }
    const response = await fetch(`/api/reviews?${params.toString()}`);
    const body = await response.json();
    setReviews(body.items);
    setTotal(body.total);
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 페이지 변경 시 목록을 다시 조회하기 위한 의도된 패칭
    fetchReviews(titleQuery, dateQuery, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchReviews, page, user]);

  function handleTitleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitleQuery(event.target.value);
  }

  function handleDateQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDateQuery(event.target.value);
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    fetchReviews(titleQuery, dateQuery, 1);
  }

  function handleCreateClick() {
    setModalState({ type: "create" });
  }

  function handleSelectReview(review: Review) {
    setModalState({ type: "detail", review });
  }

  function handleEditReview(review: Review) {
    setModalState({ type: "edit", review });
  }

  function handleDeleteReview(review: Review) {
    setDeleteErrorMessage(null);
    setModalState({ type: "delete", review });
  }

  function handleCloseModal() {
    setModalState({ type: "none" });
  }

  function handleSaved() {
    setModalState({ type: "none" });
    fetchReviews(titleQuery, dateQuery, page);
  }

  function handleConfirmDeleteClick() {
    if (modalState.type === "delete") {
      handleConfirmDelete(modalState.review);
    }
  }

  async function handleConfirmDelete(review: Review) {
    setIsDeleting(true);
    setDeleteErrorMessage(null);
    try {
      const response = await fetch(`/api/reviews/${review.id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json();
        setDeleteErrorMessage(body.message ?? "삭제에 실패했습니다.");
        return;
      }
      setModalState({ type: "none" });
      fetchReviews(titleQuery, dateQuery, page);
    } catch {
      setDeleteErrorMessage("네트워크 오류로 삭제하지 못했습니다. 다시 시도해주세요.");
    } finally {
      setIsDeleting(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-zinc-600">감상평을 작성하고 조회하려면 로그인이 필요합니다.</p>
        <div className="flex gap-2">
          <Link className="rounded border border-zinc-300 px-4 py-2" href="/login">
            로그인
          </Link>
          <Link className="rounded bg-zinc-900 px-4 py-2 text-white" href="/signup">
            회원가입
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <form className="flex flex-wrap items-center gap-2" onSubmit={handleSearchSubmit}>
        <input
          className="rounded border border-zinc-300 px-3 py-2"
          placeholder="제목 조회 조건"
          value={titleQuery}
          onChange={handleTitleQueryChange}
        />
        <input
          type="date"
          className="rounded border border-zinc-300 px-3 py-2"
          value={dateQuery}
          onChange={handleDateQueryChange}
        />
        <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white">
          조회
        </button>
        <button
          type="button"
          className="ml-auto rounded bg-zinc-900 px-4 py-2 text-white"
          onClick={handleCreateClick}
        >
          새 감상평 작성
        </button>
      </form>

      <ReviewGrid
        reviews={reviews}
        onSelect={handleSelectReview}
        onEdit={handleEditReview}
        onDelete={handleDeleteReview}
      />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {modalState.type === "create" ? (
        <ReviewFormModal mode="create" onClose={handleCloseModal} onSaved={handleSaved} />
      ) : null}

      {modalState.type === "detail" ? (
        <ReviewDetailModal review={modalState.review} onClose={handleCloseModal} onSaved={handleSaved} />
      ) : null}

      {modalState.type === "edit" ? (
        <ReviewFormModal
          mode="edit"
          initialData={modalState.review}
          onClose={handleCloseModal}
          onSaved={handleSaved}
        />
      ) : null}

      {modalState.type === "delete" ? (
        <ConfirmDialog
          message={`'${modalState.review.title}' 감상평을 삭제하시겠습니까?`}
          errorMessage={deleteErrorMessage}
          isConfirming={isDeleting}
          onConfirm={handleConfirmDeleteClick}
          onCancel={handleCloseModal}
        />
      ) : null}
    </div>
  );
}
