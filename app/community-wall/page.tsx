import Link from "next/link";
import { Metadata } from "next";
import { CommunityWallModal } from "@/app/components/CommunityWallModal";
import { getCommunityMessages } from "@/app/lib/db";
import { InfiniteCanvas } from "@/app/components/InfiniteCanvas";
import { CommunityWallCard } from "@/app/components/CommunityWallCard";
import { GridWrapper } from "../components/GridWrapper";
import { Button } from "../components/Button";

export const metadata: Metadata = {
  title: "Community Wall | Abhijit Satyaki",
  description:
    "Leave a message, share your thoughts, or just say hello on Abhijit Satyaki's Community Wall.",
};

type SearchParamProps = {
  searchParams: Promise<{ show?: string; error?: string }>;
};

export default async function Page({ searchParams }: SearchParamProps) {
  const messages = await getCommunityMessages();
  const resolvedParams = await searchParams;
  const show = resolvedParams.show === "true";
  const moderationError = ["abusive", "length", "empty"].includes(resolvedParams.error || "")
    ? resolvedParams.error
    : undefined;

  return (
    <>
      {show ? <CommunityWallModal error={moderationError} /> : null}

      {/* Page Header */}
      <div className="mt-14 pb-8 md:mt-16">
        <GridWrapper>
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="mx-auto max-w-2xl text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
                Community Wall
              </h1>
              <p className="mx-auto max-w-2xl text-center text-lg text-text-secondary">
                Leave a message, share your thoughts, or just say hello.
              </p>
              <p className="mx-auto hidden max-w-2xl text-center text-lg text-text-secondary md:block">
                Click and drag to explore all the messages scattered across the
                canvas.
              </p>
            </div>
            {/* Header Add Button (visible on both mobile and desktop) */}
            <div className="pb-2 text-center">
              <Button variant="primary" href="/community-wall?show=true">
                Leave a note
              </Button>
            </div>
          </div>
        </GridWrapper>
      </div>

      {/* Mobile: Grid Layout */}
      <div className="block min-h-screen overflow-x-clip px-4 sm:px-6 md:hidden">
        {/* Messages Grid with extra bottom padding to clear the fixed button */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 pb-36 pt-2">
          {messages?.map((message) => {
            // Subdue rotation slightly on mobile to avoid horizontal overflow
            const safeRotation = Math.max(-3, Math.min(3, Number(message.rotation) || 0));
            return (
              <CommunityWallCard
                key={message.id}
                message={message.message}
                patternIndex={message.patternindex}
                author={message.creator_name}
                profilePicture={message.creator_avatar_url}
                rotation={safeRotation}
                className="h-[310px] w-[260px] xs:w-[280px] sm:w-[295px] shadow-[6px_6px_0px_0px_rgba(99,102,241,0.2)] hover:shadow-[8px_8px_0px_0px_rgba(99,102,241,0.3)] transition-all"
              />
            );
          })}
        </div>
      </div>

      {/* Desktop: Infinite Canvas */}
      <GridWrapper className="hidden md:block">
        <InfiniteCanvas messages={messages || []} />
      </GridWrapper>

      {!show ? (
        {/* Truly Fixed Floating Action Button (FAB) on mobile - placed outside any overflow container */}
        <div className="pointer-events-none fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] inset-x-0 z-50 flex justify-center md:hidden px-4">
          <Link href="/community-wall?show=true" className="pointer-events-auto">
            <button
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-indigo-600/40 border border-indigo-400/40 backdrop-blur-md transition-all active:scale-95 hover:from-indigo-600 hover:to-indigo-700"
              aria-label="Leave a note"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:rotate-90 duration-200"
              >
                <path d="M12 4V20M4 12H20" />
              </svg>
              <span>Leave a note</span>
            </button>
          </Link>
        </div>
      ) : null}
    </>
  );
}
