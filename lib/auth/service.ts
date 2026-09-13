import { createClient } from "@/lib/supabase/server";
import { AuthError } from "@/lib/supabase/errors";

export interface AuthCredentials {
  email: string;
  password: string;
}

export async function signUpWithPassword(credentials: AuthCredentials): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp(credentials);
  if (error) {
    throw new AuthError(translateAuthErrorMessage(error.message));
  }
}

export async function signInWithPassword(credentials: AuthCredentials): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    throw new AuthError(translateAuthErrorMessage(error.message));
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

function translateAuthErrorMessage(message: string): string {
  if (message.includes("already registered")) {
    return "이미 가입된 이메일입니다.";
  }
  if (message.includes("Invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }
  if (message.includes("Password should be at least")) {
    return "비밀번호는 최소 6자 이상이어야 합니다.";
  }
  if (message.includes("Unable to validate email address")) {
    return "이메일 형식이 올바르지 않습니다.";
  }
  if (message.includes("Email signups are disabled")) {
    return "이메일 회원가입이 비활성화되어 있습니다. Supabase 대시보드에서 Email provider를 켜주세요.";
  }
  if (message.includes("Email not confirmed")) {
    return "이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.";
  }
  return message;
}
