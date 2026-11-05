"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { patterns } from "../lib/communityWall/types";
import { CommunityWallCard } from "./CommunityWallCard";

export function CreateCommunityNoteBuilder({
  onSubmit,
  creator_name = "",
  creator_avatar_url = "",
}: {
  onSubmit: (formData: FormData) => Promise<void>;
  creator_name?: string;
  creator_avatar_url?: string;
}) {
  const [author, setAuthor] = useState(creator_name || "");
  const [avatarUrl, setAvatarUrl] = useState(
    creator_avatar_url ||
      `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(creator_name || "friend")}`
  );
  const [message, setMessage] = useState("");
  const [patternIndex, setPatternIndex] = useState(() =>
    Math.floor(Math.random() * patterns.length)
  );
  const [rotation, setRotation] = useState(0);

  const handlePrevPattern = () => {
    setPatternIndex((prev) => (prev - 1 + patterns.length) % patterns.length);
  };

  const handleNextPattern = () => {
    setPatternIndex((prev) => (prev + 1) % patterns.length);
  };

  const handleAuthorChange = (val: string) => {
    setAuthor(val);
    const trimmed = val.trim();
    if (trimmed.startsWith("@") && trimmed.length > 1) {
      setAvatarUrl(`https://github.com/${trimmed.slice(1)}.png`);
    } else if (trimmed.length > 0) {
      setAvatarUrl(`https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(trimmed)}`);
    } else {
      setAvatarUrl("https://api.dicebear.com/7.x/thumbs/svg?seed=friend");
    }
  };

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  return (
    <form
      action={onSubmit}
      className="flex h-full flex-col items-center justify-center gap-4 max-w-full"
    >
      <div className="flex items-center gap-4 md:gap-6">
        <button
          type="button"
          onClick={handlePrevPattern}
          className="group hidden rounded-full bg-bg-primary stroke-[#A5AEB8] p-3 shadow-md md:block hover:bg-white"
          aria-label="Previous pattern"
        >
          <svg
            className="h-6 w-6 stroke-[#A5AEB8] group-hover:stroke-slate-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="relative flex flex-col items-center">
          <div style={{ transform: `rotate(${rotation}deg)` }} className="transition-transform duration-75">
            <CommunityWallCard
              patternIndex={patternIndex}
              author={author || "Your Name"}
              profilePicture={avatarUrl}
              rotation={0}
              className="h-[350px] w-[270px] xs:h-[390px] xs:w-[305px] sm:h-[430px] sm:w-[340px] md:h-[460px] md:w-[375px]"
            />
            <textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="absolute left-1/2 top-1/2 z-20 h-[120px] w-[80%] -translate-x-1/2 -translate-y-1/2 resize-none overflow-hidden bg-transparent text-center text-lg xs:text-xl md:text-2xl font-bold leading-tight text-zinc-900 placeholder:text-zinc-700/60 focus:outline-none"
              placeholder="Type your message here..."
              maxLength={200}
              rows={4}
              style={{
                display: "-webkit-box",
                WebkitLineClamp: "4",
                WebkitBoxOrient: "vertical",
              }}
              required
            />
          </div>

          {/* Name / Handle Input */}
          <div className="mt-3.5 w-[270px] xs:w-[305px] sm:w-[340px] md:w-[375px] rounded-xl bg-white p-2 shadow-md border border-slate-200 flex items-center gap-2">
            <span className="text-xs font-semibold text-text-tertiary px-1.5 uppercase tracking-wider">
              From:
            </span>
            <input
              type="text"
              name="creator_name"
              value={author}
              onChange={(e) => handleAuthorChange(e.target.value)}
              placeholder="Your Name or @github"
              className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
              maxLength={35}
              required
            />
          </div>

          <input type="hidden" name="creator_avatar_url" value={avatarUrl} />
          <input type="hidden" name="patternIndex" value={patternIndex} />
          <input type="hidden" name="rotation" value={rotation} />
        </div>

        <button
          type="button"
          onClick={handleNextPattern}
          className="group hidden rounded-full bg-bg-primary stroke-[#A5AEB8] p-3 shadow-md md:block hover:bg-white"
          aria-label="Next pattern"
        >
          <svg
            className="h-6 w-6 stroke-[#A5AEB8] group-hover:stroke-slate-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex w-[270px] xs:w-[305px] sm:w-[340px] md:w-[375px] justify-between items-center gap-1.5 mt-1">
        {/* Rotation Slider */}
        <div className="flex h-9 w-20 xs:w-24 items-center justify-center gap-1.5 rounded-full bg-dark-primary px-2.5 shadow">
          <input
            type="range"
            id="rotation"
            min="-10"
            max="10"
            step="0.5"
            value={rotation}
            onChange={(e) => setRotation(parseFloat(e.target.value))}
            className="w-full accent-indigo-400"
            title="Adjust tilt"
          />
        </div>

        {/* Pattern Dots */}
        <div className="flex h-9 items-center justify-center gap-1.5 xs:gap-2 rounded-full bg-dark-primary px-3 shadow">
          {patterns.map((pattern, index) => (
            <button
              key={index}
              onClick={() => setPatternIndex(index)}
              type="button"
              className={`h-3 w-3 rounded-full bg-gradient-to-b transition-all ${
                pattern.gradient
              } ${
                patternIndex === index ? "ring-2 ring-white scale-110" : "opacity-70 hover:opacity-100"
              }`}
            />
          ))}
        </div>

        {/* Actions are fixed at the bottom of the screen while the editor is open. */}
      </div>

      <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#292929]/95 p-2 shadow-2xl backdrop-blur-xl">
        <Link
          href="/community-wall"
          aria-label="Close note editor"
          className="flex h-12 min-w-24 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-rose-300 transition-colors hover:bg-white/10"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
          <span>Close</span>
        </Link>
        <div className="h-7 w-px bg-white/20" />
        <button
          type="submit"
          disabled={!message.trim() || !author.trim()}
          className="flex h-12 min-w-24 items-center justify-center gap-2 rounded-full bg-indigo-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
          title="Post note"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Yes, post</span>
        </button>
      </div>
    </form>
  );
}
