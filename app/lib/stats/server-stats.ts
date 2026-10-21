"use server";

import { unstable_cache } from "next/cache";
import { getCommunityMessagesCount } from "../db";
import type { ServerStats } from "./types";

export const getServerStats = unstable_cache(
  async (): Promise<ServerStats> => {
    const defaultStats: ServerStats = {
      totalViews: 0,
      totalReactions: 0,
      reactionsByType: {
        like: 0,
        heart: 0,
        celebrate: 0,
        insightful: 0,
      },
      topViewedArticles: [],
      topReactedArticles: [],
      communityWallMessages: 0,
    };

    try {
      const messageCount = await getCommunityMessagesCount();

      return {
        ...defaultStats,
        communityWallMessages: messageCount || 0,
      };
    } catch (error) {
      console.error("Error in getServerStats:", error);
      return defaultStats;
    }
  },
  ["server-stats"],
  { revalidate: 3600 }
);
