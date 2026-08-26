import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ReviewNotFoundError } from "./errors";
import { generateReviewId } from "./id";
import type { Review, ReviewInput } from "./types";
import { validateReviewInput } from "./validation";

interface SearchReviewsParams {
  title?: string;
  date?: string;
  page: number;
  pageSize: number;
}

interface SearchReviewsResult {
  items: Review[];
  total: number;
}

function getReviewsDir(): string {
  return path.join(process.cwd(), "savedData", "review");
}

async function ensureReviewsDir(): Promise<string> {
  const dir = getReviewsDir();
  await mkdir(dir, { recursive: true });
  return dir;
}

function getReviewFilePath(dir: string, id: string): string {
  return path.join(dir, `${id}.json`);
}

async function readReviewFile(filePath: string): Promise<Review> {
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as Review;
}

export async function listReviews(): Promise<Review[]> {
  const dir = await ensureReviewsDir();
  const fileNames = (await readdir(dir)).filter((name) => name.endsWith(".json"));
  const reviews = await Promise.all(
    fileNames.map((fileName) => readReviewFile(path.join(dir, fileName)))
  );
  return reviews.sort((a, b) => b.id.localeCompare(a.id));
}

export async function findReviewById(id: string): Promise<Review | null> {
  const dir = await ensureReviewsDir();
  try {
    return await readReviewFile(getReviewFilePath(dir, id));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function searchReviews(params: SearchReviewsParams): Promise<SearchReviewsResult> {
  const all = await listReviews();
  const titleQuery = params.title?.trim();
  const filtered = all.filter((review) => {
    const matchesTitle = !titleQuery || review.title.includes(titleQuery);
    const matchesDate = !params.date || review.createdAt === params.date;
    return matchesTitle && matchesDate;
  });
  const start = (params.page - 1) * params.pageSize;
  const items = filtered.slice(start, start + params.pageSize);
  return { items, total: filtered.length };
}

export async function createReview(input: ReviewInput): Promise<Review> {
  validateReviewInput(input);
  const dir = await ensureReviewsDir();
  const existing = await listReviews();
  const now = new Date();
  const id = generateReviewId(existing.map((review) => review.id), now);
  const review: Review = {
    id,
    title: input.title,
    rating: input.rating,
    review: input.review,
    oneLiner: input.oneLiner,
    createdAt: formatDate(now),
  };
  await writeFile(getReviewFilePath(dir, id), JSON.stringify(review, null, 2), "utf-8");
  return review;
}

export async function updateReview(id: string, input: ReviewInput): Promise<Review> {
  validateReviewInput(input);
  const dir = await ensureReviewsDir();
  const existing = await findReviewById(id);
  if (!existing) {
    throw new ReviewNotFoundError(id);
  }
  const updated: Review = {
    ...existing,
    title: input.title,
    rating: input.rating,
    review: input.review,
    oneLiner: input.oneLiner,
  };
  await writeFile(getReviewFilePath(dir, id), JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
