"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { type CurrentlyPlaying, getCurrentlyPlaying as getSpotifyCurrentlyPlaying } from "./spotify";

type ReactionType = "like" | "heart" | "celebrate" | "insightful";
const VALID_REACTIONS: ReactionType[] = [
  "like",
  "heart",
  "celebrate",
  "insightful",
];

type CreateContactResponse = {
  success: boolean;
  error?: string;
};

export async function incrementViewCount(slug: string): Promise<number> {
  return 0;
}

export async function getArticleReactions(slug: string): Promise<Record<string, number>> {
  const reactionCounts: Record<string, number> = {};
  VALID_REACTIONS.forEach((type) => {
    reactionCounts[type] = 0;
  });
  return reactionCounts;
}

export async function getUserReactions(slug: string): Promise<string[]> {
  const cookieStore = await cookies();
  const reactionsJson = cookieStore.get(`article_reactions_${slug}`)?.value;

  if (!reactionsJson) return [];

  try {
    return JSON.parse(reactionsJson) as string[];
  } catch {
    return [];
  }
}

export async function toggleReaction(slug: string, reactionType: ReactionType) {
  try {
    const cookieStore = await cookies();
    const cookieKey = `article_reactions_${slug}`;
    const userReactions = await getUserReactions(slug);
    const hasReacted = userReactions.includes(reactionType);

    const updatedReactions = hasReacted
      ? userReactions.filter((r) => r !== reactionType)
      : [...userReactions, reactionType];

    cookieStore.set(cookieKey, JSON.stringify(updatedReactions), {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    revalidatePath(`/blog/${slug}`);

    return {
      success: true,
      added: !hasReacted,
      removed: hasReacted,
      userReactions: updatedReactions,
    };
  } catch (error) {
    console.error("Error toggling reaction:", error);
    return {
      success: false,
      message: "Error processing reaction",
    };
  }
}

export async function createContact(
  email: string,
  honeypot?: string
): Promise<CreateContactResponse> {
  if (honeypot) {
    return { success: true };
  }

  try {
    const response = await fetch(
      "https://app.loops.so/api/v1/contacts/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        },
        body: JSON.stringify({ email, userGroup: "Blogfolio" }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create contact");
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create contact" };
  }
}

export async function getCurrentlyPlaying(): Promise<CurrentlyPlaying | null> {
  try {
    const result = await getSpotifyCurrentlyPlaying();
    return result || null;
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return null;
  }
}