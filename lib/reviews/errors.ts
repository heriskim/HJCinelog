export class ReviewError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReviewError";
  }
}

export class ReviewValidationError extends ReviewError {
  constructor(message: string) {
    super(message);
    this.name = "ReviewValidationError";
  }
}

export class ReviewNotFoundError extends ReviewError {
  constructor(id: string) {
    super(`감상평을 찾을 수 없습니다: ${id}`);
    this.name = "ReviewNotFoundError";
  }
}
