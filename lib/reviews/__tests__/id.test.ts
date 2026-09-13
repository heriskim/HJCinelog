import { generateReviewId } from "../id";

describe("generateReviewId", () => {
  test("해당 날짜에 기록이 없으면 00001로 시작한다", () => {
    const id = generateReviewId([], new Date("2026-08-27T10:00:00"));
    expect(id).toBe("26082700001");
  });

  test("같은 날짜의 마지막 번호 다음 값을 발번한다", () => {
    const id = generateReviewId(["26082700001", "26082700002"], new Date("2026-08-27T10:00:00"));
    expect(id).toBe("26082700003");
  });

  test("다른 날짜의 기록은 시퀀스 계산에 영향을 주지 않는다", () => {
    const id = generateReviewId(["26082600005"], new Date("2026-08-27T10:00:00"));
    expect(id).toBe("26082700001");
  });
});
