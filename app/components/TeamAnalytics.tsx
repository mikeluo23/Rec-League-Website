"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  axisTickStyle,
  chartPalette,
  gridStroke,
  piePalette,
} from "@/app/components/chartTheme";
import ChartTooltip from "@/app/components/ChartTooltip";
import {
  calcRatio,
  calcTsPercent,
  roundTo,
} from "@/lib/stats";

type TeamPlayer = {
  player_id: number;
  player_name: string;
  games_played: number;
  pts: number;
  ast: number;
  tov: number;
  fgm: number;
  fga: number;
  tpm: number;
  fta: number;
  ftm: number;
};

type TeamAnalyticsProps = {
  teamName: string;
  gamesPlayed: number;
  fgm: number;
  tpm: number;
  ftm: number;
  players: TeamPlayer[];
};

export default function TeamAnalytics({
  teamName,
  gamesPlayed,
  fgm,
  tpm,
  ftm,
  players,
}: TeamAnalyticsProps) {
  const roster = players
    .map((player) => {
      const ppg = roundTo(player.pts / (player.games_played || 1));
      const ts = calcTsPercent(player.pts, player.fga, player.fta);

      return {
        id: player.player_id,
        name: player.player_name,
        gp: player.games_played,
        ppg,
        ast: player.ast,
        astTo: calcRatio(player.ast, player.tov),
        ts,
      };
    })
    .filter((player) => player.gp > 0);

  const scoringLeaders = [...roster]
    .sort((a, b) => b.ppg - a.ppg)
    .slice(0, 8);

  const creationLeaders = [...roster]
    .filter((player) => player.ast > 0 && player.gp >= 2)
    .sort((a, b) => b.astTo - a.astTo)
    .slice(0, 8)
    .map((player) => ({
      ...player,
      astTo: Number.isFinite(player.astTo) ? player.astTo : 0,
    }));

  const efficiencyMap = roster.map((player) => ({
    name: player.name,
    ppg: roundTo(player.ppg),
    ts: roundTo(player.ts),
    gp: player.gp,
  }));

  const efficiencyHighlights = [...efficiencyMap]
    .sort((a, b) => b.ppg + b.ts / 12 - (a.ppg + a.ts / 12))
    .slice(0, 4);

  const shotMix = [
    {
      name: "2PT Points",
      value: Math.max((fgm - tpm) * 2, 0),
    },
    {
      name: "3PT Points",
      value: tpm * 3,
    },
    {
      name: "FT Points",
      value: ftm,
    },
  ].filter((segment) => segment.value > 0);

  return (
    <section className="mb-6 grid gap-6 xl:grid-cols-[1.15fr_0.95fr]">
      <div className="grid gap-6">
        <div className="rounded-[28px] border border-sky-400/20 bg-slate-950/65 p-5 shadow-[0_20px_60px_rgba(8,15,29,0.45)] backdrop-blur">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Scoring Pressure</h2>
              <p className="text-sm text-slate-400">
                {teamName} points per game leaders
              </p>
            </div>
            <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
              {gamesPlayed} GP
            </div>
          </div>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={scoringLeaders} layout="vertical" margin={{ left: 8, right: 8 }}>
                <CartesianGrid stroke={gridStroke} horizontal={false} />
                <XAxis type="number" tick={axisTickStyle} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={132}
                  tick={axisTickStyle}
                />
                <Tooltip
                  cursor={{ fill: "rgba(56, 189, 248, 0.08)" }}
                  content={<ChartTooltip />}
                />
                <Bar dataKey="ppg" radius={[0, 12, 12, 0]}>
                  {scoringLeaders.map((entry, index) => (
                    <Cell
                      key={`${entry.id}-${entry.name}`}
                      fill={chartPalette[index % chartPalette.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[28px] border border-cyan-400/20 bg-slate-950/65 p-5 shadow-[0_20px_60px_rgba(8,15,29,0.45)] backdrop-blur">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Efficiency Map</h2>
              <p className="text-sm text-slate-400">
                TS% vs scoring rate, bubble size by games played
              </p>
            </div>
          </div>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ left: 6, right: 18, top: 12, bottom: 8 }}>
                <CartesianGrid stroke={gridStroke} />
                <XAxis
                  type="number"
                  dataKey="ppg"
                  name="PPG"
                  tick={axisTickStyle}
                  stroke="rgba(125, 211, 252, 0.45)"
                />
                <YAxis
                  type="number"
                  dataKey="ts"
                  name="TS%"
                  tick={axisTickStyle}
                  stroke="rgba(34, 211, 238, 0.45)"
                />
                <ZAxis type="number" dataKey="gp" range={[80, 320]} name="GP" />
                <Tooltip
                  cursor={{ strokeDasharray: "4 4", stroke: "rgba(96, 165, 250, 0.55)" }}
                  content={<ChartTooltip showPointName />}
                />
                <Scatter
                  data={efficiencyMap}
                  fill="#38bdf8"
                  fillOpacity={0.55}
                  stroke="#7dd3fc"
                  strokeWidth={1}
                />
                <Scatter
                  data={efficiencyHighlights}
                  fill="#67e8f9"
                  stroke="#60a5fa"
                  strokeWidth={1.5}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-[28px] border border-sky-400/20 bg-slate-950/65 p-5 shadow-[0_20px_60px_rgba(8,15,29,0.45)] backdrop-blur">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-white">Team Shot Mix</h2>
            <p className="text-sm text-slate-400">Scoring split between 2s, 3s, and free throws</p>
          </div>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={shotMix}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                >
                  {shotMix.map((segment, index) => (
                    <Cell key={segment.name} fill={piePalette[index % piePalette.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-2 text-sm text-slate-300">
            {shotMix.map((segment, index) => (
              <div
                key={segment.name}
                className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: piePalette[index % piePalette.length] }}
                  />
                  <span>{segment.name}</span>
                </div>
                <span>{segment.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-blue-400/20 bg-slate-950/65 p-5 shadow-[0_20px_60px_rgba(8,15,29,0.45)] backdrop-blur">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-white">Creation Leaders</h2>
            <p className="text-sm text-slate-400">Assist-to-turnover leaders with at least 2 games</p>
          </div>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={creationLeaders} margin={{ left: 4, right: 8, top: 8 }}>
                <CartesianGrid stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey="name"
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  height={72}
                  tick={axisTickStyle}
                />
                <YAxis tick={axisTickStyle} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="astTo" radius={[12, 12, 0, 0]} fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
