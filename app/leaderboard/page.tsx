import { Suspense } from "react";
import LeaderboardClient from "./LeaderboardClient";

export default function LeaderboardPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen p-8">
          <div className="mx-auto max-w-7xl rounded-[28px] border border-sky-400/15 bg-slate-950/65 p-6 shadow-[0_20px_60px_rgba(8,15,29,0.4)] backdrop-blur">
            <h1 className="text-3xl font-bold">Leaderboard</h1>
          </div>
        </main>
      }
    >
      <LeaderboardClient />
    </Suspense>
  );
}
