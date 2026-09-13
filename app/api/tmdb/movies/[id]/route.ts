import { NextRequest, NextResponse } from "next/server";
import { fetchMovieDetail } from "@/lib/tmdb/client";
import { TmdbApiError } from "@/lib/tmdb/errors";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const { id } = await params;
  const movieId = Number(id);
  if (!Number.isInteger(movieId)) {
    return NextResponse.json({ message: "유효하지 않은 영화 ID입니다." }, { status: 400 });
  }

  try {
    const movie = await fetchMovieDetail(movieId);
    return NextResponse.json(movie);
  } catch (error) {
    if (error instanceof TmdbApiError) {
      return NextResponse.json({ message: error.message }, { status: 502 });
    }
    throw error;
  }
}
