import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import createSupabaseServerClient from "../lib/supabase/server";
import { createCommunityMessage } from "../lib/db";
import { CreateCommunityNoteBuilder } from "./CreateCommunityNoteBuilder";

async function handleCreateCommunityNote(formData: FormData) {
  "use server";

  const message = formData.get("message") as string;
  const patternIndex = parseInt((formData.get("patternIndex") as string) || "0", 10);
  const rotation = parseFloat((formData.get("rotation") as string) || "0");
  let creator_name = ((formData.get("creator_name") as string) || "").trim() || "Anonymous";
  let creator_avatar_url = ((formData.get("creator_avatar_url") as string) || "").trim();

  if (!message || !message.trim()) return;

  if (creator_name.startsWith("@")) {
    const handle = creator_name.slice(1).trim();
    if (!creator_avatar_url || creator_avatar_url.includes("dicebear")) {
      creator_avatar_url = `https://github.com/${handle}.png`;
    }
  }

  if (!creator_avatar_url) {
    creator_avatar_url = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(creator_name)}`;
  }

  await createCommunityMessage({
    message: message.trim(),
    patternindex: isNaN(patternIndex) ? 0 : patternIndex,
    rotation: isNaN(rotation) ? 0 : rotation,
    creator_name,
    creator_avatar_url,
  });

  revalidatePath("/community-wall");
  revalidatePath("/stats");
  revalidatePath("/");
  redirect("/community-wall");
}

export async function CommunityWallModal() {
  let defaultName = "";
  let defaultAvatar = "";

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.user_metadata) {
      defaultName = user.user_metadata.full_name || user.user_metadata.user_name || "";
      defaultAvatar = user.user_metadata.avatar_url || "";
    }
  } catch {
    // Supabase session lookup is optional
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <CreateCommunityNoteBuilder
          onSubmit={handleCreateCommunityNote}
          creator_name={defaultName}
          creator_avatar_url={defaultAvatar}
        />
      </div>
    </div>
  );
}
