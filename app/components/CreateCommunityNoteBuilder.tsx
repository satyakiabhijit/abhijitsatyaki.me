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
          <div style={{ transform: `rotate(${rotation}deg)` }}>
            <CommunityWallCard
              patternIndex={patternIndex}
              author={author || "Your Name"}
              profilePicture={avatarUrl}
              rotation={rotation}
              className="h-[400px] w-[320px] md:h-[450px] md:w-[375px]"
            />
            <textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="absolute left-1/2 top-1/2 z-20 h-[120px] w-[80%] -translate-x-1/2 -translate-y-1/2 resize-none overflow-hidden bg-transparent text-center text-xl md:text-2xl font-bold leading-tight placeholder-slate-900 focus:outline-none"
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
          <div className="mt-4 w-[320px] md:w-[375px] rounded-xl bg-white p-2 shadow-md border border-slate-200 flex items-center gap-2">
            <span className="text-xs font-semibold text-text-tertiary px-2 uppercase tracking-wider">
              From:
            </span>
            <input
              type="text"
              name="creator_name"
              value={author}
              onChange={(e) => handleAuthorChange(e.target.value)}
              placeholder="Your Name or @github (e.g. @satyakiabhijit)"
              className="flex-1 bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
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
      <div className="flex w-[320px] md:w-[375px] justify-between items-center mt-2">
        {/* Rotation Slider */}
        <div className="flex h-9 w-24 items-center justify-center gap-2 rounded-full bg-dark-primary px-3 shadow">
          <input
            type="range"
            id="rotation"
            min="-15"
            max="15"
            step="0.5"
            value={rotation}
            onChange={(e) => setRotation(parseFloat(e.target.value))}
            className="w-full accent-indigo-400"
            title="Adjust tilt"
          />
        </div>

        {/* Pattern Dots */}
        <div className="flex h-9 items-center justify-center gap-2 rounded-full bg-dark-primary px-4 shadow">
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

        {/* Actions: Cancel & Submit */}
        <div className="flex h-9 items-center gap-2 rounded-full bg-dark-primary px-4 shadow">
          <Link className="flex items-center justify-center" href="/community-wall">
            <button
              type="button"
              className="text-rose-400 hover:text-rose-300 transition-colors"
              title="Cancel"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </Link>
          <div className="h-4 w-[1px] bg-white/20 mx-1" />
          <button
            type="submit"
            disabled={!message.trim() || !author.trim()}
            className="text-indigo-400 hover:text-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Post note"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}
