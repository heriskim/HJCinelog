import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "시네로그",
  description: "영화의 감상평을 작성하여 보관할 수 있는 웹 페이지 서비스",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <header className="flex items-center gap-6 border-b border-zinc-200 bg-white px-6 py-4">
          <span className="text-xl font-bold">시네로그</span>
          <nav className="flex gap-4 text-sm font-medium text-zinc-600">
            <span className="rounded bg-zinc-900 px-3 py-1 text-white">감상평</span>
          </nav>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
