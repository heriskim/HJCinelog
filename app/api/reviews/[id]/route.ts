import { NextRequest, NextResponse } from "next/server";
import { ReviewNotFoundError, ReviewValidationError } from "@/lib/reviews/errors";
import { findReviewById, updateReview } from "@/lib/reviews/store";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const { id } = await params;
  const review = await findReviewById(id);
  if (!review) {
    return NextResponse.json({ message: `감상평을 찾을 수 없습니다: ${id}` }, { status: 404 });
  }
  return NextResponse.json(review);
}

export async function PUT(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const { id } = await params;
  try {
    const input = await request.json();
    const review = await updateReview(id, input);
    return NextResponse.json(review);
  } catch (error) {
    if (error instanceof ReviewNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    if (error instanceof ReviewValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    throw error;
  }
}
