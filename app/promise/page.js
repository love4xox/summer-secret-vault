"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Sparkles, Flower2, ArrowRight } from "lucide-react";

export default function PromisePage() {
  const [promises, setPromises] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("secret_notes");
      if (saved) {
        const parsed = JSON.parse(saved);
        setPromises(parsed.filter((n) => n.isPromise));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <main className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-[#FDE8EC] via-[#FFF3E8] to-[#FAF7EE] p-6 md:p-14">
      <div className="max-w-4xl mx-auto">
        {/* 상단 타이틀 */}
        <div className="flex items-center gap-3 mb-2 text-[#243E2C]">
          <Heart className="w-8 h-8 text-[#E87A90] fill-[#E87A90]" />
          <h1 className="text-3xl font-bold">소중한 약속 보관함</h1>
        </div>
        <p className="text-sm text-[#8C6B75] mb-8">
          잊지 않고 간직하고 싶은 진심 어린 다짐과 언약들
        </p>

        {/* 16:9 대표 아카이브 카드 배너 */}
        <div className="bg-[#FFFDF6] border-2 border-[#D8D0BA] rounded-3xl p-5 shadow-sm mb-10 flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-full md:w-80 aspect-video shrink-0 rounded-2xl overflow-hidden shadow-md border border-[#D8D0BA]/60 bg-[#243E2C]/5">
            <Image
              src="/cards/card2_letter.png"
              alt="스위트피 꽃편지 카드"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex-1">
            <span className="text-xs px-2.5 py-1 bg-[#FBEBEE] text-[#E87A90] rounded-full font-semibold">
              #약속 공식 아카이브
            </span>
            <h3 className="text-xl font-bold text-[#243E2C] mt-2 mb-2">
              스위트피 꽃다발 속 쪽지
            </h3>
            <p className="text-sm text-[#58795C] leading-relaxed mb-4">
              “치히로 건강해, 우리 꼭 다시 만나자.”<br />
              시간이 흘러도 가슴속에 영원히 피어나는 약속의 꽃잎.
            </p>
            <div className="text-xs text-[#8FA87B]">
              출처: 《센과 치히로의 행방불명》 시크릿 아카이브 #02
            </div>
          </div>
        </div>

        {/* 보관된 약속 목록 */}
        {promises.length === 0 ? (
          <div className="text-center py-20 bg-white/60 border border-[#D8D0BA] rounded-2xl p-8">
            <p className="text-sm text-[#8C6B75] mb-4">
              아직 보관된 약속 쪽지가 없습니다. 꽃밭에서 하트를 눌러 약속을 채워보세요.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E87A90] text-white rounded-full text-xs font-semibold hover:bg-[#D96B81] transition-colors"
            >
              <Flower2 className="w-3.5 h-3.5" /> 꽃밭에서 쪽지 찾기 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promises.map((note) => (
              <div
                key={note.id}
                className="bg-[#FFFDF6] border-2 border-[#E8C2CA] rounded-2xl p-6 shadow-sm relative"
              >
                <div className="w-12 h-3.5 bg-[#E8C2CA]/50 mx-auto -mt-7 mb-3 rounded-xs" />
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-[#E87A90]">#{note.tag}</span>
                  <Heart className="w-4 h-4 text-[#E87A90] fill-[#E87A90]" />
                </div>
                <h3 className="text-base font-bold text-[#243E2C] mb-2">{note.title}</h3>
                <p className="text-xs text-[#58795C] leading-relaxed whitespace-pre-wrap min-h-12">
                  {note.content}
                </p>
                <div className="mt-4 pt-3 border-t border-[#F0EADE] flex justify-between items-center text-[11px] text-[#8FA87B]">
                  <span>약속한 이: {note.sender || "나의 다짐"}</span>
                  <Sparkles className="w-3 h-3 text-[#E87A90]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}