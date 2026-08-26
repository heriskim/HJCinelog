"use client";

import { useCallback, useEffect, useState } from "react";
import type { Review } from "@/lib/reviews/types";
import Pagination from "./Pagination";
import ReviewDetailModal from "./ReviewDetailModal";
import ReviewFormModal from "./ReviewFormModal";
import ReviewGrid from "./ReviewGrid";

const PAGE_SIZE = 20;

type ModalState = { type: "none" } | { type: "create" } | { type: "detail"; review: Review };

export default function ReviewBoard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [titleQuery, setTitleQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [modalState, setModalState] = useState<ModalState>({ type: "none" });

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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 페이지 변경 시 목록을 다시 조회하기 위한 의도된 패칭
    fetchReviews(titleQuery, dateQuery, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchReviews, page]);

  function handleTitleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitleQuery(event.target.value);
  }

  function handleDateQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDateQuery(event.target.value);
  }

  function handleSearch() {
    setPage(1);
    fetchReviews(titleQuery, dateQuery, 1);
  }

  function handleCreateClick() {
    setModalState({ type: "create" });
  }

  function handleSelectReview(review: Review) {
    setModalState({ type: "detail", review });
  }

  function handleCloseModal() {
    setModalState({ type: "none" });
  }

  function handleSaved() {
    setModalState({ type: "none" });
    fetchReviews(titleQuery, dateQuery, page);
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center gap-2">
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
        <button type="button" className="rounded bg-zinc-900 px-4 py-2 text-white" onClick={handleSearch}>
          조회
        </button>
        <button
          type="button"
          className="ml-auto rounded bg-zinc-900 px-4 py-2 text-white"
          onClick={handleCreateClick}
        >
          새 감상평 작성
        </button>
      </div>

      <ReviewGrid reviews={reviews} onSelect={handleSelectReview} />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {modalState.type === "create" ? (
        <ReviewFormModal mode="create" onClose={handleCloseModal} onSaved={handleSaved} />
      ) : null}

      {modalState.type === "detail" ? (
        <ReviewDetailModal review={modalState.review} onClose={handleCloseModal} onSaved={handleSaved} />
      ) : null}
    </div>
  );
}
