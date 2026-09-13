export class TmdbApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TmdbApiError";
  }
}
