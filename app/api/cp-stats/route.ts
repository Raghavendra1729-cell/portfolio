import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

export const revalidate = 3600;

type PlatformSnapshot = {
  platform: "LeetCode" | "Codeforces" | "CodeChef";
  headline: string;
  subheadline: string;
  value: string;
  accent: string;
  source: "live" | "fallback";
  profileUrl: string;
};

type PlatformResult = PlatformSnapshot & {
  solvedCount: number;
};

const usernames = {
  leetcode: process.env.LEETCODE_USERNAME || "raghavendra1729",
  codeforces: process.env.CODEFORCES_USERNAME || "raghavendra_cf",
  codechef: process.env.CODECHEF_USERNAME || "raghavendra_cc",
};

const fallbackPlatforms: PlatformResult[] = [
  {
    platform: "LeetCode",
    headline: "365-day streak",
    subheadline: "700+ solved problems",
    value: "700+",
    accent: "from-amber-300/35 to-yellow-500/10",
    source: "fallback",
    profileUrl: `https://leetcode.com/u/${usernames.leetcode}`,
    solvedCount: 700,
  },
  {
    platform: "Codeforces",
    headline: "Pupil",
    subheadline: "Max rating 1210",
    value: "1210",
    accent: "from-cyan-300/35 to-sky-500/10",
    source: "fallback",
    profileUrl: `https://codeforces.com/profile/${usernames.codeforces}`,
    solvedCount: 150,
  },
  {
    platform: "CodeChef",
    headline: "3-star profile",
    subheadline: "Max rating 1680",
    value: "1680",
    accent: "from-violet-300/35 to-fuchsia-500/10",
    source: "fallback",
    profileUrl: `https://www.codechef.com/users/${usernames.codechef}`,
    solvedCount: 200,
  },
];

async function fetchLeetCode(): Promise<PlatformResult> {
  const fallback = fallbackPlatforms[0];
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      referer: `https://leetcode.com/u/${usernames.leetcode}/`,
    },
    body: JSON.stringify({
      query: `
        query userPublicProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
            userCalendar {
              streak
            }
          }
        }
      `,
      variables: { username: usernames.leetcode },
    }),
    next: { revalidate },
  });

  if (!response.ok) {
    return fallback;
  }

  const payload = (await response.json()) as {
    data?: {
      matchedUser?: {
        submitStats?: { acSubmissionNum?: Array<{ difficulty?: string; count?: number }> };
        userCalendar?: { streak?: number };
      };
    };
  };

  const stats = payload.data?.matchedUser?.submitStats?.acSubmissionNum || [];
  const totalSolved = stats.find((item) => item.difficulty === "All")?.count || fallback.solvedCount;
  const streak = payload.data?.matchedUser?.userCalendar?.streak || 365;

  return {
    ...fallback,
    headline: `${streak}-day streak`,
    subheadline: `${totalSolved}+ solved problems`,
    value: `${totalSolved}+`,
    source: "live",
    solvedCount: totalSolved,
  };
}

async function fetchCodeforces(): Promise<PlatformResult> {
  const fallback = fallbackPlatforms[1];
  const [infoResponse, statusResponse] = await Promise.all([
    fetch(`https://codeforces.com/api/user.info?handles=${usernames.codeforces}`, {
      next: { revalidate },
    }),
    fetch(`https://codeforces.com/api/user.status?handle=${usernames.codeforces}&from=1&count=200`, {
      next: { revalidate },
    }),
  ]);

  if (!infoResponse.ok || !statusResponse.ok) {
    return fallback;
  }

  const infoPayload = (await infoResponse.json()) as {
    status?: string;
    result?: Array<{ rank?: string; maxRating?: number }>;
  };
  const statusPayload = (await statusResponse.json()) as {
    status?: string;
    result?: Array<{ verdict?: string; problem?: { contestId?: number; index?: string } }>;
  };

  const user = infoPayload.result?.[0];
  const solvedCount = new Set(
    (statusPayload.result || [])
      .filter((submission) => submission.verdict === "OK")
      .map((submission) => `${submission.problem?.contestId || 0}-${submission.problem?.index || ""}`)
  ).size;

  return {
    ...fallback,
    headline: user?.rank ? capitalize(user.rank) : fallback.headline,
    subheadline: `Max rating ${user?.maxRating || 1210}`,
    value: String(user?.maxRating || 1210),
    source: "live",
    solvedCount: solvedCount || fallback.solvedCount,
  };
}

async function fetchCodeChef(): Promise<PlatformResult> {
  const fallback = fallbackPlatforms[2];
  const response = await fetch(`https://www.codechef.com/users/${usernames.codechef}`, {
    headers: {
      "user-agent": "Mozilla/5.0",
    },
    next: { revalidate },
  });

  if (!response.ok) {
    return fallback;
  }

  const html = await response.text();
  const ratingMatch = html.match(/"rating"\s*:\s*"?(\d{3,5})"?/i) || html.match(/<div class="rating-number">\s*(\d{3,5})\s*<\/div>/i);
  const starsMatch = html.match(/"stars"\s*:\s*"([^"]+)"/i) || html.match(/<span[^>]*class="rating"[^>]*>([^<]+)<\/span>/i);
  const maxRatingMatch = html.match(/"highest_rating"\s*:\s*"?(\d{3,5})"?/i);

  const currentRating = Number(ratingMatch?.[1] || 1680);
  const maxRating = Number(maxRatingMatch?.[1] || currentRating || 1680);
  const stars = starsMatch?.[1]?.trim() || "3-star profile";

  return {
    ...fallback,
    headline: stars,
    subheadline: `Max rating ${maxRating}`,
    value: String(currentRating),
    source: "live",
    solvedCount: fallback.solvedCount,
  };
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const getCachedStats = unstable_cache(
  async () => {
    const settled = await Promise.allSettled([fetchLeetCode(), fetchCodeforces(), fetchCodeChef()]);
    const platforms = settled.map((result, index) => (result.status === "fulfilled" ? result.value : fallbackPlatforms[index]));

    return {
      syncedAt: new Date().toISOString(),
      summary: {
        totalSolved: platforms.reduce((sum, platform) => sum + platform.solvedCount, 0),
        activePlatforms: platforms.length,
      },
      platforms,
    };
  },
  ["cp-stats-route-cache"],
  { revalidate }
);

export async function GET() {
  const payload = await getCachedStats();
  return NextResponse.json(payload);
}
