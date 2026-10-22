/**
 * Free, dependency-free moderation for Community Wall submissions.
 * This is a conservative keyword filter, not an AI classifier.
 */
const BLOCKED_TERMS = [
  "fuck", "fucking", "motherfucker", "shit", "bullshit", "bitch",
  "asshole", "bastard", "cunt", "dickhead", "slut", "whore",
  "nigger", "faggot", "retard",
];

function normalizeForModeration(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/0/g, "o")
    .replace(/[1!|]/g, "i")
    .replace(/3/g, "e")
    .replace(/4|@/g, "a")
    .replace(/5|\$/g, "s")
    .replace(/7/g, "t")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function moderateCommunitySubmission(name: string, message: string): {
  allowed: boolean;
  reason?: "empty" | "length" | "abusive";
} {
  const cleanName = name.trim();
  const cleanMessage = message.trim();

  if (!cleanMessage || !cleanName) return { allowed: false, reason: "empty" };
  if (cleanName.length > 35 || cleanMessage.length > 200) {
    return { allowed: false, reason: "length" };
  }

  const normalized = normalizeForModeration(`${cleanName} ${cleanMessage}`);
  const words = new Set(normalized.split(" "));
  const containsBlockedTerm = BLOCKED_TERMS.some((term) => {
    // Match complete words to avoid blocking harmless words containing a substring.
    return words.has(term);
  });

  if (containsBlockedTerm) return { allowed: false, reason: "abusive" };
  return { allowed: true };
}
