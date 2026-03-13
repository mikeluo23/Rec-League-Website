import Link from "next/link";
import { apiGet } from "@/lib/api";
import { normalizeDivision, withDivision, withQuery } from "@/lib/divisions";

type GameRow = {
  game_id: number;
  game_key: string;
  division_id?: string;
  division_label?: string;
  game_url: string;
  game_date: string;
  team1_name: string;
  team1_pts?: number;
  team2_name: string;
  team2_pts?: number;
  season?: string;
  venue?: string;
  league?: string;
};

function hasScore(game: GameRow) {
  return typeof game.team1_pts === "number" && typeof game.team2_pts === "number";
}

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ division?: string }>;
}) {
  const { division } = await searchParams;
  const divisionId = normalizeDivision(division);
  const games = await apiGet<GameRow[]>(
    withQuery("/games", { division: divisionId || undefined }),
  );

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Games</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Recent matchups with box scores and final results.
          </p>
        </div>

        {games.length === 0 ? (
          <div className="text-zinc-400">No games found.</div>
        ) : (
          <div className="grid gap-4">
            {games.map((game) => {
              const scored = hasScore(game);
              const winner =
                scored && game.team1_pts !== game.team2_pts
                  ? game.team1_pts! > game.team2_pts!
                    ? "team1"
                    : "team2"
                  : null;

              return (
                <div
                  key={game.game_id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-zinc-500">
                        <span>{game.game_date || "Unknown date"}</span>
                        {game.division_label ? <span>{game.division_label}</span> : null}
                        {game.league ? <span>{game.league}</span> : null}
                        {game.venue ? <span>{game.venue}</span> : null}
                      </div>

                      <div className="grid gap-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`min-w-0 text-lg ${winner === "team1" ? "font-semibold text-white" : "text-zinc-200"}`}
                          >
                            {game.team1_name}
                          </span>
                          {scored ? (
                            <span className="text-lg font-mono text-zinc-300">{game.team1_pts}</span>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`min-w-0 text-lg ${winner === "team2" ? "font-semibold text-white" : "text-zinc-200"}`}
                          >
                            {game.team2_name}
                          </span>
                          {scored ? (
                            <span className="text-lg font-mono text-zinc-300">{game.team2_pts}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      {game.game_url ? (
                        <a
                          className="text-sm text-zinc-400 hover:text-white"
                          href={game.game_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Source
                        </a>
                      ) : null}
                      <Link
                        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
                        href={withDivision(`/games/${game.game_id}`, divisionId)}
                      >
                        Box Score
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
