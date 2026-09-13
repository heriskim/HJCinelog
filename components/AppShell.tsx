"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AuthenticatedUser } from "@/lib/auth/session";
import MovieInfoBoard from "./MovieInfoBoard";
import ReviewBoard from "./ReviewBoard";

type Tab = "review" | "movie-info";

interface AppShellProps {
  user: AuthenticatedUser | null;
}

export default function AppShell({ user }: AppShellProps) {
  const [activeTab, setActiveTab] = useState<Tab>("review");
  const router = useRouter();

  function handleSelectReviewTab() {
    setActiveTab("review");
  }

  function handleSelectMovieInfoTab() {
    setActiveTab("movie-info");
  }

  async function handleLogoutClick() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <>
      <header className="flex items-center gap-6 border-b border-zinc-200 bg-white px-6 py-4">
        <span className="text-xl font-bold">시네로그</span>
        <nav className="flex gap-4 text-sm font-medium text-zinc-600">
          <TabButton label="감상평" isActive={activeTab === "review"} onClick={handleSelectReviewTab} />
          <TabButton
            label="영화 정보 확인하기"
            isActive={activeTab === "movie-info"}
            onClick={handleSelectMovieInfoTab}
          />
        </nav>
        <div className="ml-auto flex items-center gap-3 text-sm text-zinc-600">
          {user ? (
            <>
              <span>{user.email}</span>
              <button type="button" className="rounded border border-zinc-300 px-3 py-1" onClick={handleLogoutClick}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link className="rounded border border-zinc-300 px-3 py-1" href="/login">
                로그인
              </Link>
              <Link className="rounded bg-zinc-900 px-3 py-1 text-white" href="/signup">
                회원가입
              </Link>
            </>
          )}
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        {activeTab === "review" ? <ReviewBoard user={user} /> : <MovieInfoBoard />}
      </main>
    </>
  );
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      className={`rounded px-3 py-1 ${isActive ? "bg-zinc-900 text-white" : "hover:bg-zinc-100"}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
