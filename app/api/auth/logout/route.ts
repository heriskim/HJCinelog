import { NextResponse } from "next/server";
import { signOut } from "@/lib/auth/service";

export async function POST(): Promise<NextResponse> {
  await signOut();
  return new NextResponse(null, { status: 204 });
}
