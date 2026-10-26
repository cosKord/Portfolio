import { NextResponse } from 'next/server';
import { cpStats } from '@/data/content';

export const revalidate = 1800; // Cache for 30 minutes

interface LeetCodeGraphQLResponse {
  data?: {
    matchedUser?: {
      submitStatsGlobal?: {
        acSubmissionNum?: Array<{
          difficulty: string;
          count: number;
        }>;
      };
      profile?: {
        ranking?: number;
      };
    };
    userContestRanking?: {
      rating?: number;
      globalRanking?: number;
      totalParticipants?: number;
      topPercentage?: number;
    } | null;
  };
}

interface CodeforcesUserInfoResponse {
  status: string;
  result?: Array<{
    handle: string;
    rating?: number;
    maxRating?: number;
    rank?: string;
    maxRank?: string;
  }>;
}

interface CodeforcesRatingResponse {
  status: string;
  result?: Array<unknown>;
}

interface CodeforcesStatusResponse {
  status: string;
  result?: Array<{
    verdict?: string;
    problem?: {
      contestId?: number;
      index?: string;
    };
  }>;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lcUsername = searchParams.get('lc') || cpStats.leetcode.username;
  const cfHandle = searchParams.get('cf') || cpStats.codeforces.username;

  let leetcodeData = { ...cpStats.leetcode };
  let codeforcesData = { ...cpStats.codeforces };
  let isLcLive = false;
  let isCfLive = false;

  // 1. Fetch LeetCode Realtime Stats via GraphQL
  try {
    const lcRes = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        query: `
          query userPublicStats($username: String!) {
            matchedUser(username: $username) {
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
              profile {
                ranking
              }
            }
            userContestRanking(username: $username) {
              rating
              globalRanking
              totalParticipants
              topPercentage
            }
          }
        `,
        variables: { username: lcUsername },
      }),
      next: { revalidate: 1800 },
    });

    if (lcRes.ok) {
      const json = (await lcRes.json()) as LeetCodeGraphQLResponse;
      const matched = json?.data?.matchedUser;
      const contest = json?.data?.userContestRanking;

      if (matched?.submitStatsGlobal?.acSubmissionNum) {
        const subs = matched.submitStatsGlobal.acSubmissionNum;
        const allCount = subs.find((s) => s.difficulty === 'All')?.count ?? leetcodeData.totalSolved;
        const easyCount = subs.find((s) => s.difficulty === 'Easy')?.count ?? leetcodeData.breakdown.easy;
        const medCount = subs.find((s) => s.difficulty === 'Medium')?.count ?? leetcodeData.breakdown.medium;
        const hardCount = subs.find((s) => s.difficulty === 'Hard')?.count ?? leetcodeData.breakdown.hard;
        const rank = matched.profile?.ranking;

        leetcodeData = {
          ...leetcodeData,
          totalSolved: allCount,
          breakdown: {
            easy: easyCount,
            medium: medCount,
            hard: hardCount,
          },
          ranking: rank ? `#${rank.toLocaleString()}` : leetcodeData.ranking,
          rating: contest?.rating ? Math.round(contest.rating).toString() : 'Unrated',
        };
        isLcLive = true;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch LeetCode realtime stats:', err);
  }

  // 2. Fetch Codeforces Realtime Stats
  try {
    const [userRes, ratingRes, statusRes] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${cfHandle}`, {
        next: { revalidate: 1800 },
      }),
      fetch(`https://codeforces.com/api/user.rating?handle=${cfHandle}`, {
        next: { revalidate: 1800 },
      }),
      fetch(`https://codeforces.com/api/user.status?handle=${cfHandle}`, {
        next: { revalidate: 1800 },
      }),
    ]);

    if (userRes.ok) {
      const userJson = (await userRes.json()) as CodeforcesUserInfoResponse;
      const user = userJson?.result?.[0];

      if (user) {
        const rating = user.rating?.toString() || '0';
        const maxRating = user.maxRating?.toString() || '0';
        const rank = user.rank ? user.rank.charAt(0).toUpperCase() + user.rank.slice(1) : 'Newbie';
        const maxRank = user.maxRank ? user.maxRank.charAt(0).toUpperCase() + user.maxRank.slice(1) : 'Newbie';

        let contestsCount = codeforcesData.contests;
        if (ratingRes.ok) {
          const ratingJson = (await ratingRes.json()) as CodeforcesRatingResponse;
          if (ratingJson?.result && Array.isArray(ratingJson.result)) {
            contestsCount = ratingJson.result.length;
          }
        }

        let solvedCount = codeforcesData.totalSolved;
        if (statusRes.ok) {
          const statusJson = (await statusRes.json()) as CodeforcesStatusResponse;
          if (statusJson?.result && Array.isArray(statusJson.result)) {
            const uniqueSolved = new Set<string>();
            for (const sub of statusJson.result) {
              if (sub.verdict === 'OK' && sub.problem?.contestId && sub.problem?.index) {
                uniqueSolved.add(`${sub.problem.contestId}-${sub.problem.index}`);
              }
            }
            solvedCount = uniqueSolved.size;
          }
        }

        codeforcesData = {
          ...codeforcesData,
          rating,
          maxRating,
          rank,
          maxRank,
          contests: contestsCount,
          totalSolved: solvedCount,
        };
        isCfLive = true;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch Codeforces realtime stats:', err);
  }

  // Calculate live combined summary
  const combinedSolved = `${leetcodeData.totalSolved + codeforcesData.totalSolved}+`;
  const totalContests = codeforcesData.contests.toString();

  return NextResponse.json({
    summary: {
      ...cpStats.summary,
      totalSolved: combinedSolved,
      contests: totalContests,
    },
    leetcode: leetcodeData,
    codeforces: codeforcesData,
    isLive: isLcLive || isCfLive,
    updatedAt: new Date().toISOString(),
  });
}
