"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, FileText, Heart, Tag, ArrowRight, Download, Upload } from "lucide-react";

export default function HillPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("secret_notes");
      if (saved) setNotes(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const totalNotes = notes.length;
  const totalPromises = notes.filter((n) => n.isPromise).length;
  const tagCounts = notes.reduce((acc, cur) => {
    const t = cur.tag || "영감";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flower_garden_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data)) {
          localStorage.setItem("secret_notes", JSON.stringify(data));
          setNotes(data);
          alert("성공적으로 백업 데이터를 불러왔습니다!");
        }
      } catch {
        alert("올바르지 않은 백업 파일 형식입니다.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <main className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-[#DEEDE0] via-[#EAF4EB] to-[#F7F9F5] p-6 md:p-14 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* 헤더 및 백업 버튼 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1 text-[#243E2C]">
              <Compass className="w-8 h-8 text-[#58795C]" />
              <h1 className="text-3xl font-bold">푸른 언덕길</h1>
            </div>
            <p className="text-sm text-[#58795C]">
              개구리 석상 너머 넓은 초원에서 조망하는 생각의 발자취
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadBackup}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-2 bg-white/80 border border-[#D5E2D2] rounded-xl text-xs font-semibold text-[#243E2C] hover:bg-white transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#58795C]" /> 백업 다운로드
            </button>
            <label className="cursor-pointer flex items-center gap-1.5 px-3 py-2 bg-white/80 border border-[#D5E2D2] rounded-xl text-xs font-semibold text-[#243E2C] hover:bg-white transition-all shadow-xs">
              <Upload className="w-3.5 h-3.5 text-[#E87A90]" /> 백업 불러오기
              <input type="file" accept=".json" onChange={uploadBackup} className="hidden" />
            </label>
          </div>
        </div>

        {/* 상단 통계 카드 3종 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-[#FFFDF6] border-2 border-[#D8D0BA] rounded-3xl p-6 text-center shadow-xs">
            <FileText className="w-6 h-6 text-[#58795C] mx-auto mb-2" />
            <span className="text-xs text-[#8FA87B] font-semibold">남겨진 쪽지</span>
            <div className="text-3xl font-bold text-[#243E2C] mt-1">{totalNotes}장</div>
          </div>

          <div className="bg-[#FFFDF6] border-2 border-[#D8D0BA] rounded-3xl p-6 text-center shadow-xs">
            <Heart className="w-6 h-6 text-[#E87A90] mx-auto mb-2" />
            <span className="text-xs text-[#8FA87B] font-semibold">지켜낸 약속</span>
            <div className="text-3xl font-bold text-[#243E2C] mt-1">{totalPromises}개</div>
          </div>

          <div className="bg-[#FFFDF6] border-2 border-[#D8D0BA] rounded-3xl p-6 text-center shadow-xs">
            <Tag className="w-6 h-6 text-[#4F8490] mx-auto mb-2" />
            <span className="text-xs text-[#8FA87B] font-semibold">발견한 태그</span>
            <div className="text-3xl font-bold text-[#243E2C] mt-1">
              {Object.keys(tagCounts).length}종류
            </div>
          </div>
        </div>

        {/* 태그 현황 섹션 */}
        <div className="bg-[#FFFDF6] border-2 border-[#D8D0BA] rounded-3xl p-6 shadow-xs mb-8">
          <h2 className="text-sm font-bold text-[#243E2C] mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#58795C]" /> 초원에 핀 생각의 색깔들 (태그 현황)
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {Object.entries(tagCounts).map(([tag, count]) => (
              <span
                key={tag}
                className="px-3.5 py-1.5 bg-[#FAF7EE] border border-[#E8E2CF] rounded-full text-xs font-semibold text-[#58795C] flex items-center gap-1.5"
              >
                #{tag} <span className="text-[10px] bg-white px-1.5 py-0.5 rounded-full border border-[#D5E2D2] text-[#8FA87B]">{count}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 최근에 남긴 발자취 리스트 */}
        <div className="bg-[#FFFDF6] border-2 border-[#D8D0BA] rounded-3xl p-6 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-[#243E2C]">최근에 남긴 발자취 (최신 5개)</h2>
            <Link href="/" className="text-xs text-[#E87A90] font-semibold flex items-center gap-1 hover:underline">
              꽃밭으로 이동 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#F0EADE]">
            {notes.slice(-5).reverse().map((note) => (
              <div key={note.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-[#243E2C] mr-2">{note.title}</span>
                  <span className="text-[#8FA87B]">by {note.sender || "생각"}</span>
                </div>
                <span className="text-[#8FA87B]">최근</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}