"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Flower2, Plus, Heart, Sparkles, Trash2, Search, X, BookMarked } from "lucide-react";

const ARCHIVE_CARDS = [
  {
    id: "archive-1",
    image: "/cards/card1_chihiro.png",
    title: "꽃밭을 헤쳐 달리는 치히로",
    tag: "기억",
    desc: "바람이 머무는 꽃길의 인연",
  },
  {
    id: "archive-2",
    image: "/cards/card2_letter.png",
    title: "스위트피 꽃다발 속 쪽지",
    tag: "약속",
    desc: "치히로 건강해, 꼭 다시 만나자",
  },
  {
    id: "archive-3",
    image: "/cards/card3_haku.png",
    title: "꽃길 너머를 바라보는 하쿠",
    tag: "영감",
    desc: "터널을 완전히 빠져나갈 때까지 뒤돌아보지 마",
  },
  {
    id: "archive-4",
    image: "/cards/card4_haro.png",
    title: "밤하늘의 용 하쿠와 치히로",
    tag: "인연",
    desc: "진짜 이름을 기억해낸 순간",
  },
];

const DEFAULT_NOTES = [
  {
    id: "1",
    title: "치히로에게",
    content: "건강해야 해. 꼭 다시 만날 수 있을 거야.",
    sender: "하쿠",
    tag: "약속",
    isPromise: true,
    rotation: "-rotate-1",
  },
  {
    id: "2",
    title: "기차표 한 장",
    content: "물 위를 달리는 여섯 번째 정거장 전철 타보기.",
    sender: "나의 생각",
    tag: "영감",
    isPromise: false,
    rotation: "rotate-1",
  },
  {
    id: "3",
    title: "여름 바람 냄새",
    content: "초여름 언덕길 풀냄새와 흐드러진 분홍빛 꽃망울.",
    sender: "기억",
    tag: "조각",
    isPromise: false,
    rotation: "-rotate-2",
  },
];

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [selectedTag, setSelectedTag] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("secret_notes");
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch {
        setNotes(DEFAULT_NOTES);
      }
    } else {
      localStorage.setItem("secret_notes", JSON.stringify(DEFAULT_NOTES));
      setNotes(DEFAULT_NOTES);
    }
  }, []);

  const togglePromise = (id) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, isPromise: !n.isPromise } : n
    );
    setNotes(updated);
    localStorage.setItem("secret_notes", JSON.stringify(updated));
  };

  const deleteNote = (id) => {
    if (!confirm("이 생각 쪽지를 꽃밭에서 지우시겠습니까?")) return;
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    localStorage.setItem("secret_notes", JSON.stringify(updated));
  };

  const tags = ["전체", ...new Set(notes.map((n) => n.tag).filter(Boolean))];

  const filteredNotes = notes.filter((note) => {
    const matchesTag = selectedTag === "전체" || note.tag === selectedTag;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      note.title?.toLowerCase().includes(q) ||
      note.content?.toLowerCase().includes(q) ||
      note.sender?.toLowerCase().includes(q);
    return matchesTag && matchesQuery;
  });

  return (
    <main className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-[#E4F2E7] via-[#EFF7EE] to-[#FFF9F2] p-6 md:p-14">
      {/* 상단 헤더 */}
      <header className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between pb-8 border-b border-[#D5E2D2] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flower2 className="w-6 h-6 text-[#f08298] animate-bounce" />
            <h1 className="text-3xl font-bold tracking-tight text-[#253d2c]">
              비밀의 꽃밭 창고
            </h1>
          </div>
          <p className="text-sm text-[#58795c]">
            수풀 사이에 소중히 남겨두는 나만의 생각 쪽지함
          </p>
        </div>

        <Link
          href="/write"
          className="flex items-center gap-2 bg-[#f08298] hover:bg-[#e07086] text-white px-5 py-2.5 rounded-full shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          새 쪽지 남기기
        </Link>
      </header>

      {/* 지브리 공식 포토 카드 아카이브 섹션 (16:9 시네마틱 뷰) */}
      <section className="max-w-5xl mx-auto mt-8 mb-10">
        <div className="flex items-center gap-2 mb-4 text-[#253d2c]">
          <BookMarked className="w-5 h-5 text-[#f08298]" />
          <h2 className="text-lg font-bold">비밀 아카이브 포토 카드</h2>
        </div>

        {/* 16:9 비율의 와이드 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ARCHIVE_CARDS.map((card) => (
            <div
              key={card.id}
              className="bg-white/95 border-2 border-[#DCD5BE] rounded-2xl p-2.5 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 group cursor-pointer"
            >
              {/* 16:9 비율(aspect-video)로 꽉 채우는 사진 영역 */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#243E2C]/5">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>

              {/* 하단 타이틀 & 태그 */}
              <div className="mt-3 px-1 pb-1 flex justify-between items-center text-xs">
                <span className="font-bold text-[#253d2c] truncate mr-1.5">
                  {card.title}
                </span>
                <span className="text-[#f08298] bg-[#fbebee] px-2 py-0.5 rounded-full font-semibold shrink-0">
                  #{card.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 검색창 & 태그 필터 바 */}
      <div className="max-w-5xl mx-auto mt-6 flex flex-col md:flex-row gap-3 items-center justify-between pt-6 border-t border-[#D5E2D2]/60">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8FA87B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="꽃밭 속 쪽지 검색..."
            className="w-full bg-white/90 border border-[#D8D0BA] rounded-full pl-9 pr-8 py-2 text-xs text-[#253d2c] outline-none focus:border-[#F28C9F] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8FA87B] hover:text-[#253d2c] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 ${
                selectedTag === t
                  ? "bg-[#253d2c] text-white shadow-xs scale-105"
                  : "bg-white/80 text-[#58795c] hover:bg-white hover:text-[#253d2c]"
              }`}
            >
              {t === "전체" ? "전체 보기" : `#${t}`}
            </button>
          ))}
        </div>
      </div>

      {/* 생각 쪽지 카드 그리드 */}
      <section className="max-w-5xl mx-auto mt-8">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-20 text-[#58795c]">
            {searchQuery
              ? `"${searchQuery}"에 해당하는 쪽지를 찾지 못했습니다.`
              : "남겨진 쪽지가 없습니다. 첫 번째 편지를 꽃밭에 심어보세요!"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNotes.map((note, idx) => (
              <div
                key={note.id}
                style={{ animationDelay: `${idx * 0.15}s` }}
                className={`bg-[#fffef8] border-2 border-[#ded8c4] rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative group animate-breeze ${
                  note.rotation || ""
                }`}
              >
                <div className="w-14 h-4 bg-[#e8e2cf]/85 border border-[#ded8c4]/60 mx-auto -mt-8 mb-4 rounded-xs shadow-xs" />

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2.5 py-1 bg-[#fbebee] text-[#f08298] rounded-full font-semibold">
                    #{note.tag || "영감"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePromise(note.id)}
                      className="cursor-pointer p-1 hover:scale-110 transition-transform"
                      title="소중한 약속으로 보관"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          note.isPromise
                            ? "text-[#f08298] fill-[#f08298]"
                            : "text-[#ded8c4] hover:text-[#f08298]"
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="cursor-pointer p-1 opacity-0 group-hover:opacity-100 text-[#ded8c4] hover:text-red-400 transition-all hover:scale-110"
                      title="쪽지 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#243E2C] mb-2 leading-snug">
                  {note.title}
                </h3>
                <p className="text-sm text-[#58795c] leading-relaxed whitespace-pre-wrap min-h-16">
                  {note.content}
                </p>

                <div className="mt-4 pt-3 border-t border-[#f0eade] flex justify-between items-center text-xs text-[#8fa87b]">
                  <span>보낸이: {note.sender || "나의 생각"}</span>
                  <Sparkles className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 text-[#f08298]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}