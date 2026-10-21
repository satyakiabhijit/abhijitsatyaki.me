import { neon } from "@neondatabase/serverless";

const dbUrl = process.env.DATABASE_URL;

export const sql = dbUrl
  ? neon(dbUrl)
  : (((strings: TemplateStringsArray | string, ...values: any[]) => {
      console.warn("DATABASE_URL environment variable is not configured.");
      return Promise.resolve([]);
    }) as any);

export interface CommunityMessage {
  id: string;
  message: string;
  patternindex: number;
  rotation: number;
  user_id?: string | null;
  creator_name: string;
  creator_avatar_url: string;
  created_at?: string;
}

export async function getCommunityMessages(): Promise<CommunityMessage[]> {
  try {
    const rows = await sql`
      SELECT id, message, patternindex, rotation, user_id, creator_name, creator_avatar_url, created_at
      FROM messages
      ORDER BY created_at DESC
    `;
    return (rows || []) as CommunityMessage[];
  } catch (error) {
    console.error("Error fetching community messages from Neon:", error);
    return [];
  }
}

export async function getCommunityMessagesCount(): Promise<number> {
  try {
    const result = await sql`SELECT COUNT(*) as count FROM messages`;
    return result?.[0]?.count ? parseInt(result[0].count, 10) : 0;
  } catch (error) {
    console.error("Error getting community messages count from Neon:", error);
    return 0;
  }
}

export async function createCommunityMessage(data: {
  message: string;
  patternindex: number;
  rotation: number;
  creator_name: string;
  creator_avatar_url: string;
  user_id?: string | null;
}): Promise<CommunityMessage | null> {
  try {
    const rows = await sql`
      INSERT INTO messages (message, patternindex, rotation, creator_name, creator_avatar_url, user_id)
      VALUES (${data.message}, ${data.patternindex}, ${data.rotation}, ${data.creator_name}, ${data.creator_avatar_url}, ${data.user_id || null})
      RETURNING id, message, patternindex, rotation, user_id, creator_name, creator_avatar_url, created_at
    `;
    return (rows?.[0] as CommunityMessage) || null;
  } catch (error) {
    console.error("Error creating community message in Neon:", error);
    return null;
  }
}
