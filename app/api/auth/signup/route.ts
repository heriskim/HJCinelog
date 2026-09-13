import { NextRequest, NextResponse } from "next/server";
import { signUpWithPassword } from "@/lib/auth/service";
import { AuthError } from "@/lib/supabase/errors";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  try {
    await signUpWithPassword({ email: body.email, password: body.password });
    return NextResponse.json({ message: "회원가입이 완료되었습니다." }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    throw error;
  }
}
