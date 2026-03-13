"use client";

import { formatFixed } from "@/lib/stats";

type TooltipRow = {
  name?: string;
  value?: number | string;
  color?: string;
  payload?: Record<string, unknown>;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipRow[];
  label?: string | number;
  showPointName?: boolean;
};

export default function ChartTooltip({
  active,
  payload,
  label,
  showPointName = false,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const pointName = payload[0]?.payload?.name;
  const title =
    showPointName && typeof pointName === "string" && pointName
      ? pointName
      : typeof label === "string" || typeof label === "number"
        ? String(label)
        : "";

  return (
    <div className="min-w-44 rounded-2xl border border-sky-300/25 bg-slate-950/95 px-3 py-2 text-white shadow-[0_18px_40px_rgba(8,15,29,0.45)]">
      {title ? <div className="mb-2 text-sm font-semibold text-white">{title}</div> : null}
      <div className="grid gap-1.5">
        {payload.map((entry, index) => (
          <div key={`${entry.name}-${index}`} className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color ?? "#7dd3fc" }}
              />
              <span>{entry.name}</span>
            </div>
            <span className="font-medium text-white">
              {typeof entry.value === "number" ? formatFixed(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
