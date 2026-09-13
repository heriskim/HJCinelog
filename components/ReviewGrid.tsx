import type { Review } from "@/lib/reviews/types";

interface ReviewGridProps {
  reviews: Review[];
  onSelect: (review: Review) => void;
  onEdit: (review: Review) => void;
  onDelete: (review: Review) => void;
}

export default function ReviewGrid({ reviews, onSelect, onEdit, onDelete }: ReviewGridProps) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-zinc-300 text-left text-zinc-500">
          <th className="py-2">썸네일</th>
          <th className="py-2">영화 제목</th>
          <th className="py-2">영화 평점</th>
          <th className="py-2">작성일</th>
          <th className="py-2">수정/삭제</th>
        </tr>
      </thead>
      <tbody>
        {reviews.map((review) => (
          <ReviewRow key={review.id} review={review} onSelect={onSelect} onEdit={onEdit} onDelete={onDelete} />
        ))}
        {reviews.length === 0 ? (
          <tr>
            <td colSpan={5} className="py-8 text-center text-zinc-400">
              작성된 감상평이 없습니다.
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}

interface ReviewRowProps {
  review: Review;
  onSelect: (review: Review) => void;
  onEdit: (review: Review) => void;
  onDelete: (review: Review) => void;
}

function ReviewRow({ review, onSelect, onEdit, onDelete }: ReviewRowProps) {
  function handleClick() {
    onSelect(review);
  }

  function handleEditClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onEdit(review);
  }

  function handleDeleteClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onDelete(review);
  }

  return (
    <tr className="cursor-pointer border-b border-zinc-100 hover:bg-zinc-50" onClick={handleClick}>
      <td className="py-2">
        {review.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- 목록 썸네일 미리보기
          <img src={review.image} alt={review.title} className="h-12 w-12 rounded object-cover" />
        ) : (
          <div className="h-12 w-12 rounded bg-zinc-100" />
        )}
      </td>
      <td className="py-2">{review.title}</td>
      <td className="py-2">{review.rating.toFixed(1)}</td>
      <td className="py-2">{review.createdAt}</td>
      <td className="py-2">
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded border border-zinc-300 px-2 py-1 text-xs"
            onClick={handleEditClick}
          >
            수정
          </button>
          <button
            type="button"
            className="rounded border border-red-300 px-2 py-1 text-xs text-red-600"
            onClick={handleDeleteClick}
          >
            삭제
          </button>
        </div>
      </td>
    </tr>
  );
}
