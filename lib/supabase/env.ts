import { SupabaseConfigError } from "./errors";

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new SupabaseConfigError("NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다.");
  }
  return url;
}

export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new SupabaseConfigError("NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다.");
  }
  return key;
}

export function getSupabaseSecretKey(): string {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) {
    throw new SupabaseConfigError("SUPABASE_SECRET_KEY가 설정되지 않았습니다.");
  }
  return key;
}
