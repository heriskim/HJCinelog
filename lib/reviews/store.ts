import { createClient } from "@/lib/supabase/server";
import { ReviewNotFoundError, ReviewValidationError } from "./errors";
import { generateReviewId } from "./id";
import type { Review, ReviewInput } from "./types";
import { validateReviewInput } from "./validation";

const REVIEWS_TABLE = "reviews";
const IMAGE_BUCKET = "review-images";
const SIGNED_URL_EXPIRES_IN_SECONDS = 60 * 60;

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

interface ReviewRow {
  id: string;
  user_id: string;
  title: string;
  rating: number;
  review: string;
  one_liner: string;
  image_path: string | null;
  created_at: string;
}

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

export async function searchReviews(params: SearchReviewsParams): Promise<SearchReviewsResult> {
  const supabase = await createClient();
  let query = supabase.from(REVIEWS_TABLE).select("*", { count: "exact" });

  const titleQuery = params.title?.trim();
  if (titleQuery) {
    query = query.ilike("title", `%${titleQuery}%`);
  }
  if (params.date) {
    query = query.eq("created_at", params.date);
  }

  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize - 1;
  const { data, error, count } = await query.order("id", { ascending: false }).range(start, end);

  if (error) {
    throw new Error(error.message);
  }

  const items = await Promise.all((data ?? []).map((row) => toReview(supabase, row as ReviewRow)));
  return { items, total: count ?? 0 };
}

export async function findReviewById(id: string): Promise<Review | null> {
  const supabase = await createClient();
  const row = await findReviewRowById(supabase, id);
  if (!row) {
    return null;
  }
  return toReview(supabase, row);
}

export async function createReview(userId: string, input: ReviewInput): Promise<Review> {
  validateReviewInput(input);
  const supabase = await createClient();

  const existingIds = await listOwnReviewIds(supabase);
  const now = new Date();
  const id = generateReviewId(existingIds, now);

  const imagePath = input.image ? await uploadReviewImage(supabase, userId, id, input.image) : null;

  const { data, error } = await supabase
    .from(REVIEWS_TABLE)
    .insert({
      id,
      user_id: userId,
      title: input.title,
      rating: input.rating,
      review: input.review,
      one_liner: input.oneLiner,
      image_path: imagePath,
      created_at: formatDate(now),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toReview(supabase, data as ReviewRow);
}

export async function updateReview(id: string, input: ReviewInput): Promise<Review> {
  validateReviewInput(input);
  const supabase = await createClient();

  const existing = await findReviewRowById(supabase, id);
  if (!existing) {
    throw new ReviewNotFoundError(id);
  }

  const imagePath = await resolveImagePathForUpdate(supabase, existing, input.image);

  const { data, error } = await supabase
    .from(REVIEWS_TABLE)
    .update({
      title: input.title,
      rating: input.rating,
      review: input.review,
      one_liner: input.oneLiner,
      image_path: imagePath,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toReview(supabase, data as ReviewRow);
}

export async function deleteReview(id: string): Promise<void> {
  const supabase = await createClient();

  const existing = await findReviewRowById(supabase, id);
  if (!existing) {
    throw new ReviewNotFoundError(id);
  }

  if (existing.image_path) {
    await supabase.storage.from(IMAGE_BUCKET).remove([existing.image_path]);
  }

  const { error } = await supabase.from(REVIEWS_TABLE).delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}

async function listOwnReviewIds(supabase: SupabaseServerClient): Promise<string[]> {
  const { data, error } = await supabase.from(REVIEWS_TABLE).select("id");
  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []).map((row) => (row as { id: string }).id);
}

async function findReviewRowById(supabase: SupabaseServerClient, id: string): Promise<ReviewRow | null> {
  const { data, error } = await supabase.from(REVIEWS_TABLE).select("*").eq("id", id).maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return (data as ReviewRow) ?? null;
}

async function resolveImagePathForUpdate(
  supabase: SupabaseServerClient,
  existing: ReviewRow,
  image: string | undefined
): Promise<string | null> {
  if (!image) {
    if (existing.image_path) {
      await supabase.storage.from(IMAGE_BUCKET).remove([existing.image_path]);
    }
    return null;
  }
  if (!isDataUrl(image)) {
    return existing.image_path;
  }
  if (existing.image_path) {
    await supabase.storage.from(IMAGE_BUCKET).remove([existing.image_path]);
  }
  return uploadReviewImage(supabase, existing.user_id, existing.id, image);
}

async function uploadReviewImage(
  supabase: SupabaseServerClient,
  userId: string,
  reviewId: string,
  dataUrl: string
): Promise<string> {
  const { contentType, buffer } = decodeDataUrl(dataUrl);
  const extension = getExtensionFromContentType(contentType);
  const path = `${userId}/${reviewId}.${extension}`;

  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, buffer, {
    contentType,
  });
  if (error) {
    throw new Error(error.message);
  }
  return path;
}

async function toReview(supabase: SupabaseServerClient, row: ReviewRow): Promise<Review> {
  const image = row.image_path ? await createSignedImageUrl(supabase, row.image_path) : undefined;
  return {
    id: row.id,
    title: row.title,
    rating: row.rating,
    review: row.review,
    oneLiner: row.one_liner,
    createdAt: row.created_at,
    image,
  };
}

async function createSignedImageUrl(supabase: SupabaseServerClient, path: string): Promise<string | undefined> {
  const { data, error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .createSignedUrl(path, SIGNED_URL_EXPIRES_IN_SECONDS);
  if (error) {
    return undefined;
  }
  return data.signedUrl;
}

function isDataUrl(value: string): boolean {
  return value.startsWith("data:");
}

function decodeDataUrl(dataUrl: string): { contentType: string; buffer: Buffer } {
  const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!match) {
    throw new ReviewValidationError("이미지 형식이 올바르지 않습니다.");
  }
  const [, contentType, base64] = match;
  return { contentType, buffer: Buffer.from(base64, "base64") };
}

function getExtensionFromContentType(contentType: string): string {
  const subtype = contentType.split("/")[1] ?? "jpg";
  return subtype.split("+")[0];
}

function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
