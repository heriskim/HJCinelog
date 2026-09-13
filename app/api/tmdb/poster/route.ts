import { NextRequest, NextResponse } from "next/server";
import { TmdbApiError } from "@/lib/tmdb/errors";
import { fetchPosterAsDataUrl } from "@/lib/tmdb/client";

const POSTER_PATH_PATTERN = /^\/[\w./-]+$/;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const posterPath = request.nextUrl.searchParams.get("path");
  if (!posterPath || !POSTER_PATH_PATTERN.test(posterPath)) {
    return NextResponse.json({ message: "유효하지 않은 포스터 경로입니다." }, { status: 400 });
  }

  try {
    const image = await fetchPosterAsDataUrl(posterPath);
    return NextResponse.json({ image });
  } catch (error) {
    if (error instanceof TmdbApiError) {
      return NextResponse.json({ message: error.message }, { status: 502 });
    }
    throw error;
  }
}
