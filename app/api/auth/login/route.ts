import { NextRequest, NextResponse } from "next/server";
import { signInWithPassword } from "@/lib/auth/service";
import { AuthError } from "@/lib/supabase/errors";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  try {
    await signInWithPassword({ email: body.email, password: body.password });
    return NextResponse.json({ message: "로그인되었습니다." });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    throw error;
  }
}
