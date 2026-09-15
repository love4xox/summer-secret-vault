"use client";

import { useEffect } from "react";
import { Gowun_Batang } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Flower2, PenLine, Train, HeartHandshake, Compass } from "lucide-react";

const gowunBatang = Gowun_Batang({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  // Turbopack의 빈 unhandledRejection(undefined) 오버레이 차단
  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      if (!event.reason || event.reason === "undefined") {
        event.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  const navItems = [
    { href: "/", label: "꽃밭", icon: Flower2, color: "text-[#f08298]" },
    { href: "/write", label: "편지쓰기", icon: PenLine, color: "text-[#8fa87b]" },
    { href: "/train", label: "바다기차", icon: Train, color: "text-[#5e9ca8]" },
    { href: "/promise", label: "약속", icon: HeartHandshake, color: "text-[#E87A90]" },
    { href: "/hill", label: "푸른 언덕", icon: Compass, color: "text-[#6B8E4E]" },
  ];

  return (
    <html lang="ko">
      <body className={`${gowunBatang.className} antialiased bg-[#FAF7EE] text-[#253d2c]`}>
        {/* 상단 네비게이션 */}
        <header className="w-full bg-[#E4F2E7]/90 border-b border-[#D5E2D2] px-4 py-3 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-[#253d2c]">
              <Flower2 className="w-5 h-5 text-[#f08298]" />
              <span>비밀 창고</span>
            </Link>

            <div className="flex items-center gap-1 sm:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#58795c] hover:text-[#253d2c] px-3 py-1.5 rounded-full hover:bg-white/60 transition-colors"
                  >
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </header>

        {/* 본문 */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}