import { useContext, useMemo, useState } from "react";
import { type SubmitHandler } from "react-hook-form";
import {
  CircleArrowDown,
  CircleArrowUp,
  CircleCheck,
  CircleEqual,
  Funnel,
} from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Plus } from "lucide-react";

import type { ToDoFormInput } from "@/assets/Types";
import { ToDoForm } from "@/Components/To-DoForm";
import { ToDoItem } from "@/Components/To-DoItem";
import { Button } from "@/Components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Calendar } from "@/Components/ui/calendar";
import { ToDoContext } from "@/Context/ToDoContext";
import { ListsContext } from "@/Context/ListsContext";
import { AnalyticsCard } from "@/Components/Analytics";
import { OverviewDashboard } from "@/Components/OverviewDashboard";
import { useAnalytics } from "@/hooks/use-analytics";

export const Dashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const isSmallScreen = useIsMobile();

  const { selectedList } = useContext(ListsContext);
  const { toDos, createToDo } = useContext(ToDoContext);

  // One fetch per scope: the selected list, or everything for the overview.
  const { data: analyticsData, loading: analyticsLoading } = useAnalytics(
    selectedList._id || undefined,
  );

  const onSubmit: SubmitHandler<ToDoFormInput> = async (data) => {
    try {
      createToDo(data);

      setIsDialogOpen(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error("Create To-Do failed: ", errorMessage);
    }
  };

  const filteredToDos = useMemo(() => {
    let result = toDos;

    if (priorityFilter !== "all") {
      result = result.filter((item) => item.priority === priorityFilter);
    }

    if (statusFilter !== null) {
      result = result.filter((item) => item.isChecked === statusFilter);
    }

    if (dateRange?.from && dateRange?.to) {
      const from = new Date(dateRange.from);
      const to = new Date(dateRange.to);
      result = result.filter((item) => {
        const d = new Date(item.date);
        return d >= from && d <= to;
      });
    }
    return result;
  }, [toDos, priorityFilter, dateRange, statusFilter]);

  // No list selected -> the default dashboard with combined analytics.
  if (!selectedList._id) {
    return (
      <OverviewDashboard data={analyticsData} loading={analyticsLoading} />
    );
  }

  const resetFilters = () => {
    setPriorityFilter("all");
    setStatusFilter(null);
    setDateRange({ from: undefined, to: undefined });
  };

  const pillClass = (active: boolean) =>
    `flex h-9 items-center justify-center gap-2 rounded-full border px-3 text-sm cursor-pointer transition-colors ${
      active
        ? "border-magenta bg-magenta/20 text-foreground"
        : "border-border bg-card text-foreground hover:bg-petal dark:hover:bg-accent"
    }`;

  return (
    <div className="flex flex-col gap-4 lg:grid lg:h-full lg:grid-cols-[minmax(0,1fr)_340px] lg:grid-rows-[auto_auto_minmax(0,1fr)] lg:gap-x-6 lg:gap-y-0">
      <div className="lg:col-start-1 lg:row-start-1">
        <h1 className="scroll-m-20 text-left px-2 text-4xl font-bold tracking-tight text-balance font-display text-foreground">
          Task <span className="italic text-magenta">Overview</span>
        </h1>
        <h3 className="scroll-m-20 text-2xl px-2 my-2 tracking-tight text-foreground/90">
          {selectedList?.name || ""}
        </h3>
        <div className="border-t border-border my-3 mx-2"></div>
      </div>
      {selectedList._id ? (
        <div className="flex flex-wrap items-center justify-between gap-2 mx-2 lg:col-start-1 lg:row-start-2">
          <Button className="px-4 gap-2" onClick={() => setIsDialogOpen(true)}>
            Add Task
            <Plus strokeWidth={2.5} />
          </Button>
          <ToDoForm
            onSubmit={onSubmit}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
          <div className="flex flex-wrap items-center gap-1 md:gap-2">
            <div className="flex h-9 items-center justify-center rounded-full border border-border bg-card px-2 hover:bg-petal sm:px-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Funnel size={18} className="text-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="left" className="w-40" align="start">
                  <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Deadline Date
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="w-45 md:w-64">
                          <Calendar
                            hideWeekdays
                            className="w-full px-1 py-1 md:p-3"
                            mode="range"
                            selected={dateRange}
                            numberOfMonths={2}
                            captionLayout="dropdown"
                            onSelect={setDateRange}
                            required
                          />
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem
                            onSelect={() => setStatusFilter(true)}
                          >
                            Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => setStatusFilter(false)}
                          >
                            Incomplete
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => resetFilters()}>
                      Reset Filters
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div
              className={pillClass(priorityFilter === "all")}
              onClick={() => setPriorityFilter("all")}
            >
              <CircleCheck size={18} className="text-foreground" />
              {!isSmallScreen && "All"}
            </div>
            <div
              className={pillClass(priorityFilter === "high")}
              onClick={() => setPriorityFilter("high")}
            >
              <CircleArrowUp size={18} className="text-magenta" />
              {!isSmallScreen && "High"}
            </div>
            <div
              className={pillClass(priorityFilter === "medium")}
              onClick={() => setPriorityFilter("medium")}
            >
              <CircleEqual size={18} className="text-muted-foreground" />
              {!isSmallScreen && "Medium"}
            </div>
            <div
              className={pillClass(priorityFilter === "low")}
              onClick={() => setPriorityFilter("low")}
            >
              <CircleArrowDown size={18} className="text-muted-foreground/70" />
              {!isSmallScreen && "Low"}
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 mt-2 p-2 lg:col-start-1 lg:row-start-3 lg:min-h-0 lg:overflow-auto">
        {!selectedList._id ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
            <p className="font-display text-2xl font-bold text-foreground">
              No list selected
            </p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Create a list or pick one from the sidebar to start planning your
              tasks.
            </p>
          </div>
        ) : filteredToDos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
            <p className="font-display text-2xl font-bold text-foreground">
              Nothing here yet
            </p>
            <p className="text-sm text-muted-foreground">
              Add a task to get started.
            </p>
          </div>
        ) : (
          filteredToDos.map((toDo) => <ToDoItem key={toDo._id} data={toDo} />)
        )}
      </div>
      <aside className="px-2 lg:col-start-2 lg:row-span-3 lg:row-start-1">
        <AnalyticsCard
          data={analyticsData}
          loading={analyticsLoading}
          scope="list"
        />
      </aside>
    </div>
  );
};
