"use client";

import useSWR from "swr";
import { useState, useRef, useEffect } from "react";
import { type CurrentlyPlaying } from "app/db/spotify";
import { BentoCard } from "./BentoCard";
import { CirclePattern } from "./SpeakingBento";
import { getCurrentlyPlaying } from "@/app/db/actions";

const arijitFavorites = [
  {
    title: "Kesariya",
    artist: "Arijit Singh",
    albumName: "Brahmāstra",
    albumId: "kesariya",
    artistId: "4YRxDV8wJFPHPTeXepOstw",
    albumImageUrl: "/audio/covers/kesariya.jpg",
    audioUrl: "/audio/kesariya.m4a",
    songUrl: "https://open.spotify.com/search/Kesariya%20Arijit%20Singh",
  },
  {
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    albumName: "Aashiqui 2",
    albumId: "tum-hi-ho",
    artistId: "4YRxDV8wJFPHPTeXepOstw",
    albumImageUrl: "/audio/covers/tum-hi-ho.jpg",
    audioUrl: "/audio/tum-hi-ho.m4a",
    songUrl: "https://open.spotify.com/search/Tum%20Hi%20Ho%20Arijit%20Singh",
  },
  {
    title: "Channa Mereya",
    artist: "Arijit Singh",
    albumName: "Ae Dil Hai Mushkil",
    albumId: "channa-mereya",
    artistId: "4YRxDV8wJFPHPTeXepOstw",
    albumImageUrl: "/audio/covers/channa-mereya.jpg",
    audioUrl: "/audio/channa-mereya.m4a",
    songUrl: "https://open.spotify.com/search/Channa%20Mereya%20Arijit%20Singh",
  },
  {
    title: "Agar Tum Saath Ho",
    artist: "Arijit Singh & Alka Yagnik",
    albumName: "Tamasha",
    albumId: "agar-tum-saath-ho",
    artistId: "4YRxDV8wJFPHPTeXepOstw",
    albumImageUrl: "/audio/covers/agar-tum-saath-ho.jpg",
    audioUrl: "/audio/agar-tum-saath-ho.m4a",
    songUrl: "https://open.spotify.com/search/Agar%20Tum%20Saath%20Ho%20Arijit%20Singh",
  },
];

export function CurrentlyPlayingBento() {
  const { data: playing } = useSWR(
    "currently-playing",
    getCurrentlyPlaying,
    {
      revalidateOnFocus: true,
      refreshInterval: 60000,
      fallbackData: null,
    },
  );

  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeArijit = arijitFavorites[trackIndex];
  const isCurrentlyPlayingSpotify = !!playing;

  const currentTrack = playing || {
    artist: activeArijit.artist,
    albumName: activeArijit.albumName,
    albumId: activeArijit.albumId,
    artistId: activeArijit.artistId,
    title: activeArijit.title,
    albumImageUrl: activeArijit.albumImageUrl,
    songUrl: activeArijit.songUrl,
    isPlaying: isPlayingAudio,
  };

  const isSpinning = isCurrentlyPlayingSpotify || isPlayingAudio;

  const togglePlayAudio = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!audioRef.current) return;

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingAudio(true);
        })
        .catch((err) => {
          console.error("Audio playback error:", err);
        });
    }
  };

  const handleNextTrack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextIdx = (trackIndex + 1) % arijitFavorites.length;
    setTrackIndex(nextIdx);
    setIsPlayingAudio(false);
  };

  const handlePrevTrack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prevIdx =
      (trackIndex - 1 + arijitFavorites.length) % arijitFavorites.length;
    setTrackIndex(prevIdx);
    setIsPlayingAudio(false);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (isPlayingAudio) {
        audioRef.current.play().catch(() => setIsPlayingAudio(false));
      }
    }
  }, [trackIndex]);

  return (
    <BentoCard height="h-[300px]">
      {/* Hidden audio element for preview */}
      <audio
        ref={audioRef}
        src={activeArijit.audioUrl}
        onEnded={() => setIsPlayingAudio(false)}
      />

      <div className="flex flex-col">
        <div className="z-10 h-full">
          <div className="flex h-full flex-col justify-between">
            {/* Header with Title & Audio Controls */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-medium">
                  {isCurrentlyPlayingSpotify
                    ? "Currently Playing"
                    : "Recent Favorite"}
                </h2>
                {isPlayingAudio && (
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-0.5 animate-pulse bg-emerald-500" />
                    <span className="h-3.5 w-0.5 animate-pulse bg-emerald-500 delay-75" />
                    <span className="h-2 w-0.5 animate-pulse bg-emerald-500 delay-150" />
                  </span>
                )}
              </div>

              {/* Music Player Controls */}
              {!isCurrentlyPlayingSpotify && (
                <div className="z-30 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevTrack}
                    className="rounded-full p-1 text-text-tertiary transition hover:bg-black/5 hover:text-text-primary"
                    title="Previous Song"
                    aria-label="Previous Song"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={togglePlayAudio}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm transition hover:scale-105"
                    title={isPlayingAudio ? "Pause" : "Play preview"}
                    aria-label={isPlayingAudio ? "Pause" : "Play preview"}
                  >
                    {isPlayingAudio ? (
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg
                        className="ml-0.5 h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleNextTrack}
                    className="rounded-full p-1 text-text-tertiary transition hover:bg-black/5 hover:text-text-primary"
                    title="Next Song"
                    aria-label="Next Song"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <p className="max-h-[150px] overflow-hidden text-base text-text-secondary">
              <span className="line-clamp-4 text-ellipsis">
                I&apos;m listening to{" "}
                <a
                  className="font-semibold text-text-primary hover:underline"
                  href={currentTrack.songUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentTrack.title}
                </a>{" "}
                by{" "}
                <a
                  className="font-semibold text-text-primary hover:underline"
                  href={`https://open.spotify.com/artist/${currentTrack.artistId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentTrack.artist}
                </a>{" "}
                from the album{" "}
                <a
                  className="font-semibold text-text-primary hover:underline"
                  href={`https://open.spotify.com/album/${currentTrack.albumId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentTrack.albumName}
                </a>
              </span>
            </p>
          </div>

          {/* Vinyl Record */}
          <div className="user-select-none pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 transition-all duration-300 group-hover:-bottom-1">
            <Record
              albumImageUrl={currentTrack.albumImageUrl}
              isPlaying={isSpinning}
            />
          </div>

          {/* Album artwork in background */}
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2">
            <div
              className="h-[210px] w-[210px] rounded-sm bg-cover bg-center shadow-md transition-all duration-500"
              style={{
                backgroundImage: `url(${currentTrack.albumImageUrl})`,
              }}
            ></div>
          </div>
        </div>

        <span className="absolute -bottom-32 left-1/2 -translate-x-1/2">
          <CirclePattern />
        </span>
      </div>
    </BentoCard>
  );
}

function Record({
  albumImageUrl,
  isPlaying,
}: {
  albumImageUrl: string;
  isPlaying: boolean;
}) {
  return (
    <svg
      width="179"
      height="171"
      viewBox="0 0 179 171"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="89.5" cy="104.5" r="89.5" fill="#3C3C3F" />
      <circle
        cx="89.501"
        cy="104.5"
        r="87.06"
        stroke="#6C6D70"
        strokeWidth="1.3"
      />
      <circle
        cx="89.4992"
        cy="104.5"
        r="80.3"
        stroke="#4D4E52"
        strokeWidth="0.5"
      />
      <circle
        cx="89.4995"
        cy="104.5"
        r="69.56"
        stroke="#4D4E52"
        strokeWidth="0.5"
      />
      <circle
        cx="89.4995"
        cy="104.5"
        r="65.98"
        stroke="#4D4E52"
        strokeWidth="0.5"
      />
      <circle
        cx="89.4999"
        cy="104.5"
        r="49.87"
        stroke="#4D4E52"
        strokeWidth="0.5"
      />
      <g
        className={isPlaying ? "animate-spin-slow" : ""}
        style={{ transformOrigin: "89.5001px 104.5px" }}
      >
        <circle
          cx="89.5001"
          cy="104.5"
          r="39.13"
          fill="#4D4E52"
          stroke="#4D4E52"
          strokeWidth="0.5"
        />
        <clipPath id="albumClip">
          <circle cx="89.5001" cy="104.5" r="35" />
        </clipPath>
        <image
          href={albumImageUrl}
          x="54.5001"
          y="69.5"
          width="70"
          height="70"
          clipPath="url(#albumClip)"
        />
      </g>
      <circle cx="89.5009" cy="104.5" r="3.58" fill="#4D4E52" />
      <circle
        cx="89.5009"
        cy="104.5"
        r="3.33"
        stroke="white"
        strokeOpacity="0.3"
        strokeWidth="0.5"
      />
      <g filter="url(#filter0_f_161_134)">
        <path
          d="M88.5 97L46 26C84.8 5.60003 121.833 18.5 135.5 27.5L88.5 97Z"
          fill="white"
          fillOpacity="0.15"
          style={{ mixBlendMode: "soft-light" }}
        />
      </g>
      <path
        d="M60 22.5C69.6667 18.6667 95.1 13.3 119.5 22.5"
        stroke="url(#paint0_linear_161_134)"
      />
      <path
        d="M59 46C73.5 38.5 96 34 118.5 45.5"
        stroke="url(#paint1_linear_161_134)"
        strokeOpacity="0.3"
      />
      <defs>
        <filter
          id="filter0_f_161_134"
          x="31"
          y="0.119873"
          width="119.5"
          height="111.88"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="7.5"
            result="effect1_foregroundBlur_161_134"
          />
        </filter>
        <linearGradient
          id="paint0_linear_161_134"
          x1="60"
          y1="19.9601"
          x2="119.5"
          y2="19.9601"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.51" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_161_134"
          x1="60"
          y1="40.9601"
          x2="119.5"
          y2="40.9601"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.51" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
