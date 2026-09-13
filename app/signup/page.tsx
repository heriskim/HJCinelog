"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setSuccessMessage(null);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await response.json();
      if (!response.ok) {
        setErrorMessage(body.message ?? "회원가입에 실패했습니다.");
        return;
      }
      setSuccessMessage("가입이 완료되었습니다. 로그인해주세요.");
    } catch {
      setErrorMessage("네트워크 오류로 가입하지 못했습니다.");
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
        <h1 className="mb-6 text-xl font-bold">시네로그 회원가입</h1>
        {errorMessage ? <p className="mb-4 text-sm text-red-600">{errorMessage}</p> : null}
        {successMessage ? <p className="mb-4 text-sm text-emerald-600">{successMessage}</p> : null}
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
          minLength={6}
          className="mb-6 w-full rounded border border-zinc-300 px-3 py-2"
          value={password}
          onChange={handlePasswordChange}
        />
        <button
          type="submit"
          className="mb-3 w-full rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
          disabled={isSubmitting}
        >
          회원가입
        </button>
        <p className="text-center text-sm text-zinc-500">
          이미 계정이 있으신가요?{" "}
          <Link className="font-medium text-zinc-900 underline" href="/login">
            로그인
          </Link>
        </p>
      </form>
    </div>
  );
}
