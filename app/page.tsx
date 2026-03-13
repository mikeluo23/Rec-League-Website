import Link from "next/link";
import { apiGet } from "@/lib/api";
import { normalizeDivision, withDivision, withQuery } from "@/lib/divisions";

type Team = {
  team_id: number;
  team_name: string;
};

type Player = {
  player_id: number;
  player_name: string;
};

type Game = {
  game_id: number;
  game_date: string;
};

type Leader = {
  player_id: number;
  player_name: string;
  games_played: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  fgm: number;
  fga: number;
  tpm: number;
  tpa: number;
  ftm: number;
  fta: number;
};

function pct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ division?: string }>;
}) {
  const { division } = await searchParams;
  const divisionId = normalizeDivision(division);

  const [games, teams, players, leaderboard] = await Promise.all([
    apiGet<Game[]>(withQuery("/games", { division: divisionId || undefined, limit: 500 })),
    apiGet<Team[]>(withQuery("/teams", { division: divisionId || undefined })),
    apiGet<Player[]>(withQuery("/players", { division: divisionId || undefined })),
    apiGet<Leader[]>(withQuery("/leaderboard", { division: divisionId || undefined })),
  ]);

  const scoringLeader = leaderboard[0];
  const efficiencyLeader = [...leaderboard]
    .filter((row) => row.games_played >= 3)
    .map((row) => {
      const denom = 2 * (row.fga + 0.44 * row.fta);
      return {
        ...row,
        ts: denom ? row.pts / denom : 0,
      };
    })
    .sort((a, b) => b.ts - a.ts)[0];

  const playmakingLeader = [...leaderboard]
    .filter((row) => row.games_played >= 3)
    .map((row) => ({
      ...row,
      astTo: row.tov ? row.ast / row.tov : row.ast > 0 ? Infinity : 0,
    }))
    .sort((a, b) => b.astTo - a.astTo)[0];

  return (
    <main className="min-h-screen px-6 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-[linear-gradient(140deg,rgba(16,185,129,0.08),rgba(14,165,233,0.08),rgba(245,158,11,0.08))] p-8 sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.14),transparent_28%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-zinc-700 bg-zinc-950/60 px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-400">
                TDL Advanced Stats
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                Live rec league stats with real box score analytics.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                Browse division-level game logs, team form, and advanced player metrics without the raw-table mess.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={withDivision("/leaderboard", divisionId)}
                  className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
                >
                  Open Leaderboard
                </Link>
                <Link
                  href={withDivision("/games", divisionId)}
                  className="rounded-xl border border-zinc-700 bg-zinc-950/50 px-5 py-3 text-sm font-medium text-white transition hover:border-zinc-500 hover:bg-zinc-900"
                >
                  Browse Games
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Games</div>
                  <div className="mt-2 text-3xl font-semibold text-white">{games.length}</div>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Players</div>
                  <div className="mt-2 text-3xl font-semibold text-white">{players.length}</div>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Teams</div>
                  <div className="mt-2 text-3xl font-semibold text-white">{teams.length}</div>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Latest Game</div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    {games[0]?.game_date ?? "Unknown"}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 self-end">
              {scoringLeader ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Scoring Leader</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{scoringLeader.player_name}</div>
                  <div className="mt-1 text-sm text-zinc-400">
                    {(scoringLeader.pts / Math.max(scoringLeader.games_played, 1)).toFixed(1)} PPG
                  </div>
                </div>
              ) : null}
              {efficiencyLeader ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Best TS% (min 3 GP)</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{efficiencyLeader.player_name}</div>
                  <div className="mt-1 text-sm text-zinc-400">{pct(efficiencyLeader.ts)}</div>
                </div>
              ) : null}
              {playmakingLeader ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Best AST/TO (min 3 GP)</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{playmakingLeader.player_name}</div>
                  <div className="mt-1 text-sm text-zinc-400">
                    {Number.isFinite(playmakingLeader.astTo) ? playmakingLeader.astTo.toFixed(2) : "Perfect"}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <Link
            href={withDivision("/players", divisionId)}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 transition hover:border-zinc-600 hover:bg-zinc-900"
          >
            <div className="text-xs uppercase tracking-wide text-zinc-500">Players</div>
            <h2 className="mt-3 text-2xl font-semibold text-white">Player profiles and efficiency splits</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Game logs, shot profiles, TS%, eFG%, AST/TO, and one-click box score access.
            </p>
          </Link>

          <Link
            href={withDivision("/teams", divisionId)}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 transition hover:border-zinc-600 hover:bg-zinc-900"
          >
            <div className="text-xs uppercase tracking-wide text-zinc-500">Teams</div>
            <h2 className="mt-3 text-2xl font-semibold text-white">Roster strength and team analytics</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Record, recent form, scoring profile, and advanced efficiency context for every roster.
            </p>
          </Link>

          <Link
            href={withDivision("/games", divisionId)}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 transition hover:border-zinc-600 hover:bg-zinc-900"
          >
            <div className="text-xs uppercase tracking-wide text-zinc-500">Games</div>
            <h2 className="mt-3 text-2xl font-semibold text-white">Clean matchups and box scores</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Final scores, venue context, grouped team box scores, and direct source links.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}
