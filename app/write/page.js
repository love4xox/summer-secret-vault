"use client";

import { useState } from "react";
import { PenLine, Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("영감");
  const [sender, setSender] = useState("");

  const tagList = ["영감", "약속", "기억", "아이디어"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해 주세요.");
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      sender: sender.trim() || "나의 생각",
      tag,
      isPromise: tag === "약속",
      rotation: Math.random() > 0.5 ? "rotate-1" : "-rotate-1",
      createdAt: new Date().toLocaleDateString("ko-KR"),
    };

    try {
      const saved = localStorage.getItem("secret_notes");
      const existing = saved ? JSON.parse(saved) : [];
      localStorage.setItem("secret_notes", JSON.stringify([newNote, ...existing]));
      router.push("/");
    } catch (err) {
      console.error(err);
      router.push("/");
    }
  };

  return (
    <main className="min-h-[calc(100vh-65px)] bg-[#F7F4EB] py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-xl bg-[#FFFDF6] border-2 border-[#D8D0BA] rounded-2xl p-6 sm:p-8 shadow-xl mt-4 relative z-20">
        
        <div className="flex items-center gap-2 mb-6 text-[#243E2C]">
          <PenLine className="w-5 h-5 text-[#8FA87B]" />
          <h2 className="text-2xl font-bold">꽃밭에 남길 편지 적기</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#5E7C60] mb-1.5">
              제목
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="생각의 제목을 적어주세요"
              className="w-full bg-[#FAF7EE] border border-[#DCD5BE] rounded-lg px-4 py-2.5 text-[#243E2C] text-sm outline-none focus:border-[#F28C9F] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E7C60] mb-2">
              태그 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {tagList.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTag(t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    tag === t
                      ? "bg-[#F28C9F] text-white border-[#F28C9F] shadow-sm"
                      : "bg-[#FAF7EE] text-[#5E7C60] border-[#DCD5BE] hover:bg-white"
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E7C60] mb-1.5">
              내용
            </label>
            <textarea
              rows={5}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="꽃잎 사이에 숨겨둘 소중한 문장이나 아이디어를 남겨보세요..."
              className="w-full bg-[#FAF7EE] border border-[#DCD5BE] rounded-lg p-4 text-[#243E2C] text-sm outline-none focus:border-[#F28C9F] focus:bg-white leading-relaxed resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E7C60] mb-1.5">
              보낸이 이름
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="예: 하쿠, 치히로 (비워두면 '나의 생각')"
              className="w-full bg-[#FAF7EE] border border-[#DCD5BE] rounded-lg px-4 py-2 text-[#243E2C] text-sm outline-none focus:border-[#F28C9F] focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-2 bg-[#F28C9F] hover:bg-[#E07086] active:opacity-90 text-white py-3.5 rounded-xl font-semibold shadow-md transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            꽃밭 속에 꽂아두기
          </button>
        </form>
      </div>
    </main>
  );
}