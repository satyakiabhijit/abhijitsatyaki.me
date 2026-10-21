import { patterns } from "app/lib/communityWall/types";

type CommunityWallCardProps = {
  patternIndex: number;
  message?: string;
  rotation?: number;
  author?: string;
  profilePicture?: string;
  className?: string;
};

export function CommunityWallCard({
  patternIndex,
  message = "",
  rotation = 0,
  author = "",
  profilePicture = "",
  className = "",
}: CommunityWallCardProps) {
  const pattern = patterns[patternIndex % patterns.length];

  return (
    <div
      className={`flex flex-col items-start justify-between gap-2 rounded-xl border border-zinc-300/40 bg-[#F7F7F8] p-2.5 transition-transform ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div
        className={`h-full w-full rounded-md bg-gradient-to-b ${pattern.gradient} relative flex items-center justify-center text-balance p-4 text-center overflow-hidden shadow-inner`}
      >
        {pattern.svg}
        <p className="z-10 line-clamp-6 text-center text-lg sm:text-xl font-bold text-zinc-900 leading-snug select-none">
          {message}
        </p>
      </div>
      <div className="flex w-full items-center space-x-2 pt-0.5">
        <img
          src={profilePicture || `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(author || "friend")}`}
          className="h-8 w-8 flex-shrink-0 rounded-full border border-zinc-300 bg-zinc-100 object-cover"
          alt={`${author}'s avatar`}
        />
        <p className="truncate text-xs sm:text-sm font-semibold text-zinc-800">{author}</p>
      </div>
    </div>
  );
}
