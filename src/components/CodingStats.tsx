'use client';

import { useEffect, useState } from 'react';
import { cpStats } from '@/data/content';

export default function CodingStats() {
  const [stats, setStats] = useState(cpStats);

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      try {
        const res = await fetch('/api/coding-stats');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setStats(data);
          }
        }
      } catch (err) {
        console.warn('Using cached CP stats:', err);
      }
    }

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const { leetcode, codeforces } = stats;

  // Percentage calculations for LeetCode distribution bar
  const total = leetcode.breakdown.easy + leetcode.breakdown.medium + leetcode.breakdown.hard;
  const easyPct = total ? (leetcode.breakdown.easy / total) * 100 : 0;
  const medPct = total ? (leetcode.breakdown.medium / total) * 100 : 0;
  const hardPct = total ? (leetcode.breakdown.hard / total) * 100 : 0;

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2">
        {/* LeetCode Card */}
        <div
          className="group relative h-full rounded-[2px] border border-hairline bg-surface/40 p-6 transition-colors duration-300 hover:bg-surface md:p-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl text-accent">LeetCode</h3>
              <p className="mt-1 font-mono text-xs text-muted">@{leetcode.username}</p>
            </div>

            <a
              href={leetcode.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-b border-hairline pb-1 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <span>Profile</span>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 border-y border-hairline py-5 text-center">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Solved</p>
              <p className="mt-2 font-serif text-2xl text-parchment">{leetcode.totalSolved}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Rating</p>
              <p className="mt-2 font-serif text-2xl text-parchment">{leetcode.rating}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Global rank</p>
              <p className="mt-2 font-serif text-lg text-parchment">{leetcode.ranking}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted">
              <span>Difficulty</span>
              <span>{total} problems</span>
            </div>

            <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-full bg-ink">
              <div style={{ width: `${easyPct}%` }} className="bg-accent transition-all duration-500" title={`Easy: ${leetcode.breakdown.easy}`} />
              <div style={{ width: `${medPct}%` }} className="bg-accent/60 transition-all duration-500" title={`Medium: ${leetcode.breakdown.medium}`} />
              <div style={{ width: `${hardPct}%` }} className="bg-accent/25 transition-all duration-500" title={`Hard: ${leetcode.breakdown.hard}`} />
            </div>

            <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-muted">
              <span>
                Easy: {leetcode.breakdown.easy}
              </span>
              <span>
                Med: {leetcode.breakdown.medium}
              </span>
              <span>
                Hard: {leetcode.breakdown.hard}
              </span>
            </div>
          </div>
        </div>

        <div
          className="group relative h-full rounded-[2px] border border-hairline bg-surface/40 p-6 transition-colors duration-300 hover:bg-surface md:p-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl text-accent">Codeforces</h3>
              <p className="mt-1 font-mono text-xs text-muted">@{codeforces.username}</p>
            </div>

            <a
              href={codeforces.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-b border-hairline pb-1 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <span>Profile</span>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 border-y border-hairline py-5 text-center">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Rating</p>
              <p className="mt-2 font-serif text-2xl text-parchment">{codeforces.rating}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Peak</p>
              <p className="mt-2 font-serif text-2xl text-parchment">{codeforces.maxRating}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Contests</p>
              <p className="mt-2 font-serif text-2xl text-parchment">{codeforces.contests}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-hairline/70 pb-3">
              <span className="text-muted">Current rank</span>
              <span className="text-parchment">{codeforces.rank}</span>
            </div>

            <div className="flex items-center justify-between border-b border-hairline/70 pb-3">
              <span className="text-muted">Peak rank</span>
              <span className="text-parchment">{codeforces.maxRank}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted">Problems solved</span>
              <span className="text-parchment">{codeforces.totalSolved}+</span>
            </div>
          </div>
        </div>
    </div>
  );
}
