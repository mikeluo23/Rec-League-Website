type AnalyticsMethodologyProps = {
  includeTeamMetrics?: boolean;
};

const coreMetrics = [
  {
    label: "Per-game stats",
    formula: "PTS / GP, REB / GP, AST / GP",
    note: "Used for PPG, RPG, and APG.",
  },
  {
    label: "FG%, 3P%, FT%",
    formula: "FGM / FGA, 3PM / 3PA, FTM / FTA",
    note: "Shown as percentages.",
  },
  {
    label: "TS%",
    formula: "PTS / (2 x (FGA + 0.44 x FTA))",
    note: "Displayed as a percentage.",
  },
  {
    label: "eFG%",
    formula: "(FGM + 0.5 x 3PM) / FGA",
    note: "Displayed as a percentage.",
  },
  {
    label: "AST/TO",
    formula: "AST / TOV",
    note: "If turnovers are zero, the current app falls back to division by 1 instead of infinity.",
  },
  {
    label: "3PA Rate",
    formula: "3PA / FGA",
    note: "Displayed as a percentage.",
  },
  {
    label: "FT Rate",
    formula: "FTA / FGA",
    note: "Displayed as a percentage.",
  },
  {
    label: "Shot Mix",
    formula: "2PT points = 2 x (FGM - 3PM), 3PT points = 3 x 3PM, FT points = FTM",
    note: "Used in the shot mix chart.",
  },
  {
    label: "Stocks / Game",
    formula: "(STL + BLK) / GP",
    note: "Defensive event volume per game.",
  },
  {
    label: "TOV Rate Proxy",
    formula: "TOV / (FGA + 0.44 x FTA + TOV)",
    note: "Displayed as a percentage.",
  },
  {
    label: "Points Per Shot Attempt",
    formula: "PTS / (FGA + 0.44 x FTA)",
    note: "Scoring output per shooting possession proxy.",
  },
  {
    label: "2P%",
    formula: "(FGM - 3PM) / (FGA - 3PA)",
    note: "Displayed as a percentage.",
  },
  {
    label: "2PA Rate",
    formula: "(FGA - 3PA) / FGA",
    note: "Displayed as a percentage.",
  },
  {
    label: "Shot Diet Shares",
    formula: "2PT share, 3PT share, FT share = points from source / total scoring points",
    note: "Breaks down where scoring volume comes from.",
  },
  {
    label: "Game Score",
    formula: "PTS + 0.4 x FGM - 0.7 x FGA - 0.4 x (FTA - FTM) + 0.7 x REB + 0.7 x AST + STL + 0.7 x BLK - 0.4 x PF - TOV",
    note: "Current implementation is a box-score composite proxy.",
  },
  {
    label: "Scoring / REB / AST Share",
    formula: "Player total / team total",
    note: "Displayed as a percentage on team pages.",
  },
  {
    label: "Consistency",
    formula: "Standard deviation and median over game-by-game values",
    note: "Used to show volatility in points and TS% on player pages.",
  },
  {
    label: "Win / Loss Splits",
    formula: "Per-game metrics recalculated separately for wins and losses",
    note: "Shown when the page has result data.",
  },
];

const teamMetrics = [
  {
    label: "Win%",
    formula: "Wins / Games Played",
    note: "Displayed as a percentage.",
  },
  {
    label: "Off Rating",
    formula: "Points For / Games Played",
    note: "This is a per-game scoring rate, not a possession-based offensive rating.",
  },
  {
    label: "Def Rating",
    formula: "Points Against / Games Played",
    note: "This is a per-game allowed rate, not a possession-based defensive rating.",
  },
  {
    label: "Net Rating",
    formula: "Off Rating - Def Rating",
    note: "Point differential per game.",
  },
  {
    label: "SOS",
    formula: "Average opponent Net Rating",
    note: "Strength of schedule is based on opponents already played.",
  },
  {
    label: "Opp Win%",
    formula: "Average opponent Win%",
    note: "Secondary schedule-strength check.",
  },
  {
    label: "Adj Off",
    formula: "Team Off Rating - Avg Opp Def Rating + League Avg Points",
    note: "Opponent-adjusted scoring estimate.",
  },
  {
    label: "Adj Def",
    formula: "Team Def Rating - Avg Opp Off Rating + League Avg Points",
    note: "Opponent-adjusted points-allowed estimate.",
  },
  {
    label: "Adj Net",
    formula: "Adj Off - Adj Def",
    note: "Opponent-adjusted point differential per game.",
  },
];

export default function AnalyticsMethodology({
  includeTeamMetrics = false,
}: AnalyticsMethodologyProps) {
  const metrics = includeTeamMetrics ? [...coreMetrics, ...teamMetrics] : coreMetrics;

  return (
    <section className="rounded-[28px] border border-sky-400/15 bg-slate-950/65 p-5 shadow-[0_20px_60px_rgba(8,15,29,0.4)] backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">How Metrics Are Calculated</h2>
          <p className="mt-1 text-sm text-slate-400">
            These formulas match the current site logic so the analytics stay transparent.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3"
          >
            <div className="text-sm font-semibold text-white">{metric.label}</div>
            <div className="mt-2 font-mono text-xs text-sky-200">{metric.formula}</div>
            <div className="mt-2 text-xs leading-5 text-slate-400">{metric.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
