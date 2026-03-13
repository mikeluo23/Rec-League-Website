import TeamStandingsTable from "@/app/components/TeamStandingsTable";
import { apiGet } from "@/lib/api";
import Link from "next/link";
import { normalizeDivision, withDivision, withQuery } from "@/lib/divisions";

type Team = {
  team_id: number;
  team_name: string;
  division_label?: string;
  wins?: number;
  losses?: number;
  win_pct?: number;
  strength_of_schedule?: number;
  offensive_rating?: number;
  defensive_rating?: number;
  adjusted_net_rating?: number;
};

export default async function TeamsPage({
  searchParams,
}: {
  searchParams: Promise<{ division?: string }>;
}) {
  const { division } = await searchParams;
  const divisionId = normalizeDivision(division);
  const teams = await apiGet<Team[]>(
    withQuery("/teams", { division: divisionId || undefined }),
  );

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Teams</h1>
          <Link
            href={withDivision("/teams/compare", divisionId)}
            className="rounded-xl border border-zinc-700 bg-zinc-950/60 px-4 py-2 text-sm text-white transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Compare Teams
          </Link>
        </div>

        <TeamStandingsTable teams={teams} division={divisionId} />
      </div>
    </main>
  );
}
