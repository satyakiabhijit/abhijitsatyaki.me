"use server";

import { unstable_cache } from "next/cache";
import type { GitHubStats, ContributionData, ContributionDay, ContributionWeek } from "./types";

const GITHUB_REPO = "satyakiabhijit/abhijitsatyaki.me";
const GITHUB_USERNAME = "satyakiabhijit";

async function fetchContributionsPublic(): Promise<ContributionData | null> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const levelMap: Record<number, "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE"> = {
      0: "NONE",
      1: "FIRST_QUARTILE",
      2: "SECOND_QUARTILE",
      3: "THIRD_QUARTILE",
      4: "FOURTH_QUARTILE",
    };
    const days: ContributionDay[] = (data.contributions || []).map((c: { date: string; count: number; level: number }) => ({
      date: c.date,
      contributionCount: c.count,
      contributionLevel: levelMap[c.level] || "NONE",
    }));

    const weeks: ContributionWeek[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push({ contributionDays: days.slice(i, i + 7) });
    }

    // Keep the heatmap to the last 12 months, but show the all-time public total.
    // This account's public contribution history starts in 2024.
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2024 + 1 }, (_, index) => 2024 + index);
    const yearlyTotals = await Promise.all(
      years.map(async (year) => {
        if (year === currentYear) {
          const currentYearTotal = Object.values(data.total || {}).reduce(
            (sum: number, count: unknown) => sum + (typeof count === "number" ? count : 0),
            0,
          );
          return currentYearTotal;
        }
        const yearRes = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=${year}`,
          { next: { revalidate: 86400 } },
        );
        if (!yearRes.ok) return 0;
        const yearData = await yearRes.json();
        return Object.values(yearData.total || {}).reduce(
          (sum: number, count: unknown) => sum + (typeof count === "number" ? count : 0),
          0,
        );
      }),
    );
    const totalContributions = yearlyTotals.reduce((sum, count) => sum + count, 0);

    return {
      totalContributions,
      weeks,
    };
  } catch (error) {
    console.error("Error fetching public contributions:", error);
    return null;
  }
}

async function fetchContributionsGraphQL(token: string): Promise<ContributionData | null> {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const query = `
    query {
      user(login: "${GITHUB_USERNAME}") {
        contributionsCollection(from: "${oneYearAgo.toISOString()}", to: "${today.toISOString()}") {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const calendar = data?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return null;

    return {
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks,
    };
  } catch (error) {
    console.error("Error fetching GraphQL contributions:", error);
    return null;
  }
}

export const getGitHubStats = unstable_cache(
  async (): Promise<GitHubStats> => {
    const token = process.env.GITHUB_TOKEN;

    try {
      let stars = 0;
      let forks = 0;

      // 1. Fetch public repositories
      const reposRes = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json", "User-Agent": "nextjs" }
            : { Accept: "application/vnd.github.v3+json", "User-Agent": "nextjs" },
        }
      );

      if (reposRes.ok) {
        const repos = await reposRes.json();
        if (Array.isArray(repos)) {
          stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
          forks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
        }
      }

      // 2. Fetch contributions
      let contributions: ContributionData | null = null;
      if (token) {
        contributions = await fetchContributionsGraphQL(token);
      }
      if (!contributions) {
        contributions = await fetchContributionsPublic();
      }

      const commits = contributions?.totalContributions || 306;

      return {
        stars: stars || 8,
        forks: forks || 8,
        commits,
        contributions,
      };
    } catch (error) {
      console.error("Error fetching GitHub stats:", error);
      return {
        stars: 8,
        forks: 8,
        commits: 306,
        contributions: null,
      };
    }
  },
  ["github-stats-satyakiabhijit"],
  { revalidate: 86400 }
);
