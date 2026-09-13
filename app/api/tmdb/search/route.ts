import { NextRequest, NextResponse } from "next/server";
import { TmdbApiError } from "@/lib/tmdb/errors";
import { searchMovies } from "@/lib/tmdb/client";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const query = request.nextUrl.searchParams.get("query")?.trim();
  if (!query) {
    return NextResponse.json({ results: [] });
  }
  try {
    const results = await searchMovies(query);
    return NextResponse.json({ results });
  } catch (error) {
    if (error instanceof TmdbApiError) {
      return NextResponse.json({ message: error.message }, { status: 502 });
    }
    throw error;
  }
}
