import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createCommunityMessage } from "../lib/db";
import { moderateCommunitySubmission } from "../lib/communityModeration";
import { CreateCommunityNoteBuilder } from "./CreateCommunityNoteBuilder";

async function handleCreateCommunityNote(formData: FormData) {
  "use server";

  const message = String(formData.get("message") ?? "");
  const rawPatternIndex = parseInt(String(formData.get("patternIndex") ?? "0"), 10);
  const patternIndex = Number.isFinite(rawPatternIndex) ? Math.max(0, Math.min(20, rawPatternIndex)) : 0;
  const rawRotation = parseFloat(String(formData.get("rotation") ?? "0"));
  const rotation = Number.isFinite(rawRotation) ? Math.max(-10, Math.min(10, rawRotation)) : 0;
  const creator_name = String(formData.get("creator_name") ?? "").trim() || "Anonymous";

  // Server-side moderation runs before the database insert. Client-side checks can be bypassed.
  const moderation = moderateCommunitySubmission(creator_name, message);
  if (!moderation.allowed) {
    const error = moderation.reason === "abusive" ? "abusive" : moderation.reason === "length" ? "length" : "empty";
    redirect(`/community-wall?show=true&error=${error}`);
  }

  // Build avatar URLs on the server instead of trusting a hidden form field.
  const creator_avatar_url = creator_name.startsWith("@")
    ? `https://github.com/${encodeURIComponent(creator_name.slice(1).trim())}.png`
    : `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(creator_name)}`;

  await createCommunityMessage({
    message: message.trim(),
    patternindex: patternIndex,
    rotation,
    creator_name,
    creator_avatar_url,
  });

  revalidatePath("/community-wall");
  revalidatePath("/stats");
  revalidatePath("/");
  redirect("/community-wall");
}

export async function CommunityWallModal({ error }: { error?: string }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-black/80 backdrop-blur-md">
      <Link
        href="/community-wall"
        aria-label="Close note editor"
        className="absolute inset-0 z-0 cursor-default"
        tabIndex={-1}
      />
      <div className="relative z-10 flex min-h-full flex-col items-center justify-center gap-3 p-3 pb-24 pt-8 sm:p-6 sm:pb-24">
        {error ? (
          <p role="alert" className="max-w-md rounded-lg border border-rose-400/40 bg-rose-950/80 px-4 py-3 text-center text-sm text-rose-100">
            {error === "abusive"
              ? "Please remove abusive or hateful language before posting your note."
              : error === "length"
                ? "Your name must be 35 characters or fewer and your note 200 characters or fewer."
                : "Please enter your name and a message before posting."}
          </p>
        ) : null}
        <CreateCommunityNoteBuilder
          onSubmit={handleCreateCommunityNote}
          creator_name=""
          creator_avatar_url=""
        />
      </div>
    </div>
  );
}
