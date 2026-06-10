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

  const resetFilters = () => {
    setPriorityFilter("all");
    setStatusFilter(null);
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <>
      <h1 className="scroll-m-20 text-left px-2 text-4xl font-semibold tracking-tight text-balance">
        Task Overview
      </h1>
      <h3 className="scroll-m-20 text-2xl px-2 my-2 tracking-tight text-black dark:text-white">
        {selectedList?.name || ""}
      </h3>
      <div className="border border-gray-200 m-2"></div>
      {selectedList?.name ? (
        <div className="flex mx-2 justify-between">
          <Button
            className="bg-foreground px-3 md:px-4 gap-1 md:gap-2 hover:bg-[#FFFFFF] hover:border-2 hover:border-[#2097f3] active:bg-[#2097f3] active:text-white active:outline-2 active:outline-[#85C7F8] hover:text-black hover:shadow-lg active:shadow-none active:border-1 active:border-white text-white"
            variant="outline"
            onClick={() => setIsDialogOpen(true)}
          >
            Add Task
            <Plus strokeWidth={3} />
          </Button>
          <ToDoForm
            onSubmit={onSubmit}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
          <div className="min-h-[100%] grid grid-cols-5 gap-[0px] md:gap-2!">
            <div className="bg-white! dark:bg-[#1e3a5f]! w-[35px] sm:w-[60px] justify-self-end h-full flex items-center justify-center rounded-md sm:px-2 border-1 ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Funnel size={20} className="dark:text-white" />
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
              className="bg-white! dark:bg-[#1e3a5f]! dark:text-white text-sm h-full flex gap-2 cursor-pointer items-center justify-center rounded-md sm:px-3 border-1"
              onClick={() => setPriorityFilter("all")}
            >
              <CircleCheck size={20} color="#2097f3" />
              {!isSmallScreen && "All"}
            </div>
            <div
              className="bg-white! dark:bg-[#1e3a5f]! dark:text-white h-full text-sm flex items-center cursor-pointer gap-2 justify-center rounded-md sm:px-3 border-1"
              onClick={() => setPriorityFilter("high")}
            >
              <CircleArrowUp size={20} color="red" />
              {!isSmallScreen && "High"}
            </div>
            <div
              className="bg-white! dark:bg-[#1e3a5f]! h-full text-sm dark:text-white flex items-center cursor-pointer gap-2 justify-center rounded-md sm:px-3 border-1"
              onClick={() => setPriorityFilter("medium")}
            >
              <CircleEqual size={20} color="orange" />
              {!isSmallScreen && "Medium"}
            </div>
            <div
              className="bg-white! dark:bg-[#1e3a5f]! h-full text-sm flex dark:text-white items-center cursor-pointer gap-2 justify-center rounded-md md:px-3 border-1"
              onClick={() => setPriorityFilter("low")}
            >
              <CircleArrowDown size={20} color="green" />
              {!isSmallScreen && "Low"}
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 mt-2 p-2 overflow-scroll h-[calc(100%-130px)]">
        {(() => {
          if (filteredToDos && selectedList) {
            return filteredToDos.map((toDo, index) => (
              <ToDoItem key={index} data={toDo} />
            ));
          }
        })()}
      </div>
    </>
  );
};
