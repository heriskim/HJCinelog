"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await response.json();
      if (!response.ok) {
        setErrorMessage(body.message ?? "로그인에 실패했습니다.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setErrorMessage("네트워크 오류로 로그인하지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <form
        className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-6 text-xl font-bold">시네로그 로그인</h1>
        {errorMessage ? <p className="mb-4 text-sm text-red-600">{errorMessage}</p> : null}
        <label className="mb-1 block text-sm text-zinc-600" htmlFor="email">
          이메일
        </label>
        <input
          id="email"
          type="email"
          required
          className="mb-4 w-full rounded border border-zinc-300 px-3 py-2"
          value={email}
          onChange={handleEmailChange}
        />
        <label className="mb-1 block text-sm text-zinc-600" htmlFor="password">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          required
          className="mb-6 w-full rounded border border-zinc-300 px-3 py-2"
          value={password}
          onChange={handlePasswordChange}
        />
        <button
          type="submit"
          className="mb-3 w-full rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
          disabled={isSubmitting}
        >
          로그인
        </button>
        <p className="text-center text-sm text-zinc-500">
          계정이 없으신가요?{" "}
          <Link className="font-medium text-zinc-900 underline" href="/signup">
            회원가입
          </Link>
        </p>
      </form>
    </div>
  );
}
