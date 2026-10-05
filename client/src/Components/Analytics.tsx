import { Card } from "@/Components/ui/card";
import type { AnalyticsType, PriorityAnalytics } from "@/assets/Types";

const PRIORITY_ROWS = [
  { key: "high", label: "High", dot: "bg-magenta", bar: "bg-magenta" },
  { key: "medium", label: "Medium", dot: "bg-amber", bar: "bg-amber" },
  {
    key: "low",
    label: "Low",
    dot: "bg-lavender-smoke",
    bar: "bg-lavender-smoke",
  },
];

const EMPTY_ENTRY: PriorityAnalytics = {
  total: 0,
  completed: 0,
  avgCompletionMs: null,
};

const formatDuration = (ms: number | null) => {
  if (ms === null || Number.isNaN(ms)) return "—";

  const minutes = Math.round(ms / 60000);
  if (minutes < 1) return "<1m";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours < 24) {
    return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours ? `${days}d ${remainingHours}h` : `${days}d`;
};

const StatTile = ({
  label,
  value,
  valueClass = "text-foreground",
}: {
  label: string;
  value: string | number;
  valueClass?: string;
}) => (
  <div className="rounded-[10px] border border-border bg-petal px-3 py-2 dark:bg-accent/40">
    <p className={`font-display text-2xl font-bold leading-none ${valueClass}`}>
      {value}
    </p>
    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
      {label}
    </p>
  </div>
);

interface AnalyticsCardProps {
  data: AnalyticsType | null;
  loading: boolean;
  scope?: "all" | "list";
}

export const AnalyticsCard = ({
  data,
  loading,
  scope = "all",
}: AnalyticsCardProps) => {
  const totals = data?.totals;
  const completionPct = Math.round((totals?.completionRate ?? 0) * 100);
  const days = data?.completedLast7Days ?? [];
  const peakDay = Math.max(1, ...days.map((day) => day.count));

  return (
    <Card className="w-full border-border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
          Analytics
        </h2>
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {scope === "all" ? "All lists" : "This list"}
        </span>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Loading…
        </p>
      ) : !totals || totals.total === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No tasks yet — add one to see insights.
        </p>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <StatTile
              label="Completed"
              value={totals.completed}
              valueClass="text-magenta"
            />
            <StatTile label="Active" value={totals.active} />
            <StatTile
              label="Overdue"
              value={totals.overdue}
              valueClass={
                totals.overdue > 0 ? "text-destructive" : "text-foreground"
              }
            />
            <StatTile label="Completion" value={`${completionPct}%`} />
          </div>

          <div className="my-3 border-t border-border" />

          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            By priority
          </p>
          <div className="mt-2 flex flex-col gap-3">
            {PRIORITY_ROWS.map((row) => {
              const entry = data.byPriority[row.key] ?? EMPTY_ENTRY;
              const pct = entry.total
                ? Math.round((entry.completed / entry.total) * 100)
                : 0;

              return (
                <div key={row.key}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <span className={`h-2 w-2 rounded-full ${row.dot}`} />
                      {row.label}
                    </span>
                    <span className="text-muted-foreground">
                      {entry.completed}/{entry.total}
                      <span className="mx-1">·</span>
                      avg {formatDuration(entry.avgCompletionMs)}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${row.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="my-3 border-t border-border" />

          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Completed · last 7 days
            </p>
            <span className="text-[11px] text-muted-foreground">
              avg {formatDuration(data.avgCompletionMs)}
            </span>
          </div>
          <div className="mt-2 flex h-10 items-end gap-1">
            {days.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} completed`}
                className={`min-h-[3px] flex-1 rounded-t-[3px] ${
                  day.count ? "bg-magenta/70" : "bg-muted"
                }`}
                style={{
                  height: `${
                    day.count ? Math.max(10, (day.count / peakDay) * 100) : 6
                  }%`,
                }}
              />
            ))}
          </div>
        </>
      )}
    </Card>
  );
};
