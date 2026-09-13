import { ReviewValidationError } from "../errors";
import { validateReviewInput } from "../validation";
import type { ReviewInput } from "../types";

function buildInput(overrides: Partial<ReviewInput> = {}): ReviewInput {
  return {
    title: "인터스텔라",
    rating: 4.5,
    review: "우주와 시간을 다룬 걸작.",
    oneLiner: "인생 영화",
    ...overrides,
  };
}

describe("validateReviewInput", () => {
  test("정상 입력은 통과한다", () => {
    expect(() => validateReviewInput(buildInput())).not.toThrow();
  });

  test("제목이 비어있으면 에러를 던진다", () => {
    expect(() => validateReviewInput(buildInput({ title: "  " }))).toThrow(ReviewValidationError);
  });

  test("제목이 30자를 초과하면 에러를 던진다", () => {
    expect(() => validateReviewInput(buildInput({ title: "가".repeat(31) }))).toThrow(ReviewValidationError);
  });

  test("평점이 0.5 단위가 아니면 에러를 던진다", () => {
    expect(() => validateReviewInput(buildInput({ rating: 4.3 }))).toThrow(ReviewValidationError);
  });

  test("평점이 범위를 벗어나면 에러를 던진다", () => {
    expect(() => validateReviewInput(buildInput({ rating: 5.5 }))).toThrow(ReviewValidationError);
    expect(() => validateReviewInput(buildInput({ rating: 0.5 }))).toThrow(ReviewValidationError);
  });

  test("감상평이 2000자를 초과하면 에러를 던진다", () => {
    expect(() => validateReviewInput(buildInput({ review: "가".repeat(2001) }))).toThrow(
      ReviewValidationError
    );
  });

  test("한줄평이 100자를 초과하면 에러를 던진다", () => {
    expect(() => validateReviewInput(buildInput({ oneLiner: "가".repeat(101) }))).toThrow(
      ReviewValidationError
    );
  });

  test("이미지가 없으면 통과한다", () => {
    expect(() => validateReviewInput(buildInput({ image: undefined }))).not.toThrow();
  });

  test("이미지가 10MB를 초과하면 에러를 던진다", () => {
    const oversizedBase64 = "A".repeat(15 * 1024 * 1024);
    expect(() =>
      validateReviewInput(buildInput({ image: `data:image/png;base64,${oversizedBase64}` }))
    ).toThrow(ReviewValidationError);
  });
});
