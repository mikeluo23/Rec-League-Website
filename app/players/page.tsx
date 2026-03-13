import { apiGet } from "@/lib/api";
import Link from "next/link";
import { normalizeDivision, withDivision, withQuery } from "@/lib/divisions";

type Player = {
  player_id: number;
  player_name: string;
  division_count?: number;
  division_labels?: string[];
};

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; division?: string }>;
}) {
  const { q, division } = await searchParams;
  const query = (q ?? "").toLowerCase().trim();
  const divisionId = normalizeDivision(division);

  const players = await apiGet<Player[]>(
    withQuery("/players", { division: divisionId || undefined }),
  );
  const filtered = query
    ? players.filter((p) => p.player_name.toLowerCase().includes(query))
    : players;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Players</h1>
            <p className="text-zinc-400 text-sm mt-1">
              {filtered.length} player{filtered.length === 1 ? "" : "s"}
              {query ? ` matching "${q}"` : ""}
            </p>
          </div>

          {query ? (
            <Link
              href={withDivision("/players", divisionId)}
              className="text-zinc-300 hover:text-white text-sm"
            >
              Clear
            </Link>
          ) : null}
        </div>

        <div className="bg-zinc-900/70 rounded-2xl border border-zinc-800 overflow-hidden">
          <ul className="divide-y divide-zinc-800">
            {filtered.map((p) => (
              <li key={p.player_id} className="p-4 hover:bg-zinc-800/60 transition">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={withDivision(`/players/${String(p.player_id)}`, divisionId)}
                    className="hover:underline"
                  >
                    {p.player_name}
                  </Link>
                  {!divisionId && p.division_labels?.length ? (
                    <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-zinc-400">
                      {p.division_labels.map((label) => (
                        <span
                          key={`${p.player_id}-${label}`}
                          className="rounded-full border border-zinc-700 bg-zinc-950/60 px-2 py-1"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {filtered.length === 0 ? (
          <div className="text-zinc-400 mt-4">
            No players found.
          </div>
        ) : null}
      </div>
    </main>
  );
}
