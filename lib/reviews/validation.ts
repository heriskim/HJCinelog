import { ReviewValidationError } from "./errors";
import type { ReviewInput } from "./types";

const TITLE_MAX_LENGTH = 30;
const REVIEW_MAX_LENGTH = 2000;
const ONE_LINER_MAX_LENGTH = 100;
const RATING_MIN = 1;
const RATING_MAX = 5;
const RATING_STEP = 0.5;
export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;

export function validateReviewInput(input: ReviewInput): void {
  if (!input.title.trim()) {
    throw new ReviewValidationError("제목을 입력해주세요.");
  }
  if (input.title.length > TITLE_MAX_LENGTH) {
    throw new ReviewValidationError(`제목은 최대 ${TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`);
  }
  if (!isValidRating(input.rating)) {
    throw new ReviewValidationError(
      `평점은 ${RATING_MIN}~${RATING_MAX} 사이의 ${RATING_STEP} 단위 숫자여야 합니다.`
    );
  }
  if (!input.review.trim()) {
    throw new ReviewValidationError("감상평을 입력해주세요.");
  }
  if (input.review.length > REVIEW_MAX_LENGTH) {
    throw new ReviewValidationError(`감상평은 최대 ${REVIEW_MAX_LENGTH}자까지 입력할 수 있습니다.`);
  }
  if (input.oneLiner.length > ONE_LINER_MAX_LENGTH) {
    throw new ReviewValidationError(`한줄평은 최대 ${ONE_LINER_MAX_LENGTH}자까지 입력할 수 있습니다.`);
  }
  if (input.image) {
    validateImage(input.image);
  }
}

function validateImage(image: string): void {
  const base64 = image.includes(",") ? image.slice(image.indexOf(",") + 1) : image;
  const sizeInBytes = Math.floor((base64.length * 3) / 4);
  if (sizeInBytes > IMAGE_MAX_BYTES) {
    throw new ReviewValidationError("이미지는 최대 10MB까지 등록할 수 있습니다.");
  }
}

function isValidRating(rating: number): boolean {
  if (!Number.isFinite(rating)) {
    return false;
  }
  if (rating < RATING_MIN || rating > RATING_MAX) {
    return false;
  }
  const steps = rating / RATING_STEP;
  return Math.abs(steps - Math.round(steps)) < Number.EPSILON * 100;
}
