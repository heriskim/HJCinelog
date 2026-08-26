import { NextRequest, NextResponse } from "next/server";
import { ReviewValidationError } from "@/lib/reviews/errors";
import { createReview, searchReviews } from "@/lib/reviews/store";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get("title") ?? undefined;
  const date = searchParams.get("date") ?? undefined;
  const page = Number(searchParams.get("page") ?? "1") || 1;
  const result = await searchReviews({ title, date, page, pageSize: PAGE_SIZE });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const input = await request.json();
    const review = await createReview(input);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof ReviewValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    throw error;
  }
}
