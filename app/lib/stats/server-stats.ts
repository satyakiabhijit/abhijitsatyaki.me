"use server";

import { unstable_cache } from "next/cache";
import { createSupabaseAdminClient } from "../supabase/server";
import { posts } from "#site/content";
import { getCommunityMessagesCount } from "../db";
import type { ServerStats, ReactionType, ArticleMetric } from "./types";

const VALID_REACTIONS: ReactionType[] = [
  "like",
  "heart",
  "celebrate",
  "insightful",
];

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
      const supabase = await createSupabaseAdminClient();
      if (!supabase) return defaultStats;

      const { data: viewsData, error: viewsError } = await supabase
        .from("article_views")
        .select("slug, view_count");

      if (viewsError) {
        console.warn("Could not fetch article_views:", viewsError.message);
      }

      const totalViews =
        viewsData?.reduce((sum, row) => sum + row.view_count, 0) || 0;

      const { data: reactionsData, error: reactionsError } = await supabase
        .from("article_reactions")
        .select("article_slug, reaction_type, count");

      if (reactionsError) {
        console.warn("Could not fetch article_reactions:", reactionsError.message);
      }

      const reactionsByType: Record<ReactionType, number> = {
        like: 0,
        heart: 0,
        celebrate: 0,
        insightful: 0,
      };

      reactionsData?.forEach((row) => {
        if (VALID_REACTIONS.includes(row.reaction_type as ReactionType)) {
          reactionsByType[row.reaction_type as ReactionType] += row.count;
        }
      });

      const totalReactions = Object.values(reactionsByType).reduce(
        (sum, count) => sum + count,
        0
      );

      const topViewedRaw =
        viewsData
          ?.sort((a, b) => b.view_count - a.view_count)
          .slice(0, 5)
          .map((item) => {
            const post = posts.find((p) => p.slug === item.slug);
            return {
              slug: item.slug,
              title: post?.title || item.slug,
              count: item.view_count,
              imageName: post?.imageName,
            };
          }) || [];

      const reactionsPerArticle: Record<string, number> = {};
      reactionsData?.forEach((row) => {
        reactionsPerArticle[row.article_slug] =
          (reactionsPerArticle[row.article_slug] || 0) + row.count;
      });

      const topReactedRaw: ArticleMetric[] = Object.entries(reactionsPerArticle)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([slug, count]) => {
          const post = posts.find((p) => p.slug === slug);
          return {
            slug,
            title: post?.title || slug,
            count,
            imageName: post?.imageName,
          };
        });

      const { count: messageCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true });

      return {
        totalViews,
        totalReactions,
        reactionsByType,
        topViewedArticles: topViewedRaw,
        topReactedArticles: topReactedRaw,
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
