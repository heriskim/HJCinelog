import { NextResponse } from "next/server";
import { fetchNowPlayingMovies } from "@/lib/tmdb/client";
import { TmdbApiError } from "@/lib/tmdb/errors";

export async function GET(): Promise<NextResponse> {
  try {
    const movies = await fetchNowPlayingMovies();
    return NextResponse.json({ movies });
  } catch (error) {
    if (error instanceof TmdbApiError) {
      return NextResponse.json({ message: error.message }, { status: 502 });
    }
    throw error;
  }
}
