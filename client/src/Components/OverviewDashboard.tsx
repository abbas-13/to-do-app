import { useContext } from "react";
import { ArrowRight } from "lucide-react";

import { AnalyticsCard } from "@/Components/Analytics";
import { ListsContext } from "@/Context/ListsContext";
import type { AnalyticsType } from "@/assets/Types";

interface OverviewDashboardProps {
  data: AnalyticsType | null;
  loading: boolean;
}

export const OverviewDashboard = ({
  data,
  loading,
}: OverviewDashboardProps) => {
  const { lists, selectList } = useContext(ListsContext);
  const totals = data?.totals;
  const byList = data?.byList ?? [];

  const statsFor = (listId: string) =>
    byList.find((item) => item.listId === listId);

  return (
    <div className="flex flex-col gap-4 lg:grid lg:h-full lg:grid-cols-[minmax(0,1fr)_340px] lg:grid-rows-[minmax(0,1fr)] lg:gap-x-6">
      <div className="flex min-w-0 flex-col lg:min-h-0 lg:overflow-auto">
        <h1 className="scroll-m-20 px-2 text-left text-4xl font-bold tracking-tight font-display text-foreground">
          <span className="italic text-magenta">All</span> Lists
        </h1>
        <p className="px-2 mt-1 text-sm text-muted-foreground">
          Combined analytics across every list
          {totals
            ? ` · ${totals.total} task${totals.total === 1 ? "" : "s"}`
            : ""}
        </p>
        <div className="border-t border-border my-3 mx-2"></div>

        {lists.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="font-display text-2xl font-bold text-foreground">
              No lists yet
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Create a list from the sidebar to start tracking tasks and see
              insights here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 px-2 sm:grid-cols-2">
            {lists.map((list) => {
              const stats = statsFor(list._id);
              const total = stats?.total ?? 0;
              const completedCount = stats?.completed ?? 0;
              const pct = total
                ? Math.round((completedCount / total) * 100)
                : 0;

              return (
                <button
                  key={list._id}
                  type="button"
                  onClick={() => selectList(list._id, list.name)}
                  className="group flex flex-col gap-3 rounded-[10px] border border-border bg-card p-4 text-left transition-colors hover:bg-petal dark:hover:bg-accent"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-display text-lg font-bold tracking-tight text-foreground">
                      {list.name || "Untitled list"}
                    </span>
                    <ArrowRight
                      size={16}
                      className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {completedCount}/{total} completed
                    </span>
                    <span>{pct}%</span>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-magenta"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {stats && stats.overdue > 0 ? (
                    <span className="text-[11px] font-medium text-destructive">
                      {stats.overdue} overdue
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <aside className="px-2 lg:col-start-2 lg:row-start-1">
        <AnalyticsCard data={data} loading={loading} scope="all" />
      </aside>
    </div>
  );
};
