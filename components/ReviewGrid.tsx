import type { Review } from "@/lib/reviews/types";

interface ReviewGridProps {
  reviews: Review[];
  onSelect: (review: Review) => void;
}

export default function ReviewGrid({ reviews, onSelect }: ReviewGridProps) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-zinc-300 text-left text-zinc-500">
          <th className="py-2">영화 제목</th>
          <th className="py-2">영화 평점</th>
          <th className="py-2">작성일</th>
        </tr>
      </thead>
      <tbody>
        {reviews.map((review) => (
          <ReviewRow key={review.id} review={review} onSelect={onSelect} />
        ))}
        {reviews.length === 0 ? (
          <tr>
            <td colSpan={3} className="py-8 text-center text-zinc-400">
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
}

function ReviewRow({ review, onSelect }: ReviewRowProps) {
  function handleClick() {
    onSelect(review);
  }

  return (
    <tr className="cursor-pointer border-b border-zinc-100 hover:bg-zinc-50" onClick={handleClick}>
      <td className="py-2">{review.title}</td>
      <td className="py-2">{review.rating.toFixed(1)}</td>
      <td className="py-2">{review.createdAt}</td>
    </tr>
  );
}
