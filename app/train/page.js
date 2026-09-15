"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Train, ChevronLeft, ChevronRight, Heart, Flower2, Volume2, VolumeX } from "lucide-react";

export default function TrainPage() {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem("secret_notes");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) setCards(parsed);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleAmbientSound = async () => {
    if (typeof window === "undefined") return;

    if (isPlaying) {
      if (audioCtxRef.current) {
        try {
          if (audioCtxRef.current.state !== "closed") {
            await audioCtxRef.current.close();
          }
        } catch {}
        audioCtxRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return alert("오디오 미지원 브라우저입니다.");

      const ctx = new AudioCtx();
      if (ctx.state === "suspended") await ctx.resume();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start(0);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        audioCtxRef.current = null;
        if (ctx.state !== "closed") {
          ctx.close().catch(() => {});
        }
      }
    };
  }, []);

  if (!isClient) return null;

  if (cards.length === 0) {
    return (
      <main className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-[#A5C9D7] via-[#C9DFE6] to-[#E9F1F2] p-8 flex flex-col items-center justify-center">
        <div className="bg-[#FFFDF6]/90 border border-[#D8D0BA] rounded-2xl p-8 text-center max-w-sm shadow-md">
          <p className="text-[#58795C] mb-4 text-sm">아직 기차에 실린 쪽지가 없습니다.</p>
          <Link
            href="/write"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F28C9F] text-white rounded-full text-xs font-semibold"
          >
            <Flower2 className="w-3.5 h-3.5" /> 쪽지 적으러 가기
          </Link>
        </div>
      </main>
    );
  }

  const current = cards[index] || cards[0];

  return (
    <main className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-[#94BCCB] via-[#BED8DF] to-[#E8F1EE] p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* 잔잔한 구름 */}
      <div className="absolute top-10 left-12 text-white/30 text-7xl select-none font-bold">☁</div>
      <div className="absolute top-16 right-20 text-white/20 text-9xl select-none font-bold">☁</div>

      {/* 우측 상단 하늘을 나는 보우 쥐 스티커 */}
      <div className="absolute top-10 right-8 md:right-24 pointer-events-none select-none z-20 animate-bounce duration-1000 drop-shadow-xl">
        <Image
          src="/characters/boh-rat.png"
          alt="하늘을 나는 보우 쥐"
          width={130}
          height={180}
          className="w-auto h-auto object-contain"
          priority
        />
      </div>

      {/* 상단 사운드 컨트롤 */}
      <div className="flex items-center justify-between w-full max-w-lg mb-4 z-10">
        <div className="flex items-center gap-2 text-[#243E2C]">
          <Train className="w-5 h-5 text-[#4F8490]" />
          <h2 className="text-xl font-bold tracking-tight">바다 위 전철 창밖 뷰</h2>
        </div>

        <button
          onClick={toggleAmbientSound}
          className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
            isPlaying
              ? "bg-[#4F8490] text-white border-[#4F8490] shadow-xs animate-pulse"
              : "bg-white/80 text-[#4F8490] border-[#BCD4DC] hover:bg-white"
          }`}
        >
          {isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{isPlaying ? "잔잔한 파도소리 ON" : "앰비언트 켜기"}</span>
        </button>
      </div>

      {/* 중앙 생각 카드 */}
      <div className="w-full max-w-lg bg-[#FFFDF6]/95 border-2 border-[#D8D0BA] rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-md flex flex-col justify-between min-h-84 relative z-10">
        <div className="flex justify-between items-center text-xs font-semibold text-[#4F8490] uppercase tracking-widest border-b border-[#E8E2CF] pb-3">
          <span>Stop {index + 1} / {cards.length}</span>
          <span className="flex items-center gap-1 text-[#f08298]">
            #{current?.tag || "영감"}
            {current?.isPromise && <Heart className="w-3.5 h-3.5 fill-[#f08298]" />}
          </span>
        </div>

        <div className="my-6">
          <h3 className="text-2xl font-bold text-[#243E2C] mb-4">
            {current?.title}
          </h3>
          <p className="text-base text-[#58795C] leading-relaxed whitespace-pre-wrap">
            {current?.content}
          </p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-[#E8E2CF]">
          <button
            onClick={() => setIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1))}
            className="cursor-pointer p-2.5 rounded-full bg-[#FAF7EE] hover:bg-[#F28C9F] hover:text-white transition-colors text-[#58795C]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs text-[#8FA87B]">
            기록자: {current?.sender || "나의 생각"}
          </span>
          <button
            onClick={() => setIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0))}
            className="cursor-pointer p-2.5 rounded-full bg-[#FAF7EE] hover:bg-[#F28C9F] hover:text-white transition-colors text-[#58795C]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}