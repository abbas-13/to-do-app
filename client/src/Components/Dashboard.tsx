import {
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { SubmitHandler } from "react-hook-form";
import {
  CircleArrowDown,
  CircleArrowUp,
  CircleCheck,
  CircleEqual,
  Funnel,
} from "lucide-react";
import { type DateRange } from "react-day-picker";

import type { ToDoFormInput, ToDoState } from "@/assets/Types";
import { ToDoForm } from "@/Components/To-DoForm";
import { ToDoItem } from "@/Components/To-DoItem";
import { SelectListContext } from "@/Context/SelectListContext";
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

interface DashboardProps {
  toDos: ToDoState[];
  setToDos: Dispatch<SetStateAction<ToDoState[]>>;
  fetchToDoLists: () => void;
}

export const Dashboard = ({
  toDos,
  setToDos,
  fetchToDoLists,
}: DashboardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [filteredToDos, setFilteredToDos] = useState<ToDoState[]>();

  const isSmallScreen = useIsMobile();

  const { selectedList } = useContext(SelectListContext);

  const onSubmit: SubmitHandler<ToDoFormInput> = async (data) => {
    try {
      const newToDo = {
        list: selectedList._id,
        toDoName: data.toDoName,
        notes: data.notes,
        date: new Date(data.date),
        time: data.time,
        isChecked: false,
        priority: data.priority,
        dateCreated: new Date(),
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/toDos`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newToDo),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const { body } = await response.json();

      setToDos([...toDos, body]);
      setIsDialogOpen(false);
      setIsSubmitSuccessful(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error("Create To-Do failed: ", errorMessage);
    }
  };

  const checkToDo = async (toDoId: string, isChecked: boolean) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/toDos/${toDoId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isChecked: isChecked }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const updatedToDos = toDos.map((toDo) =>
        toDo._id === toDoId ? { ...toDo, isChecked: !toDo.isChecked } : toDo,
      );

      setToDos(updatedToDos);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error("PUT failed: ", errorMessage);
    }
  };

  const deleteToDo = async (toDoId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/toDos/${toDoId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const updatedToDos = toDos.filter((toDo) => toDo._id !== toDoId);
      setToDos(updatedToDos);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error("Delete todo failed: ", errorMessage);
    }
  };

  const priorityFilter = (priority: string) => {
    if (priority === "all") {
      setFilteredToDos(toDos);
    } else {
      const updatedToDos = toDos.filter(
        (item: ToDoState) => item.priority === priority,
      );

      setFilteredToDos(updatedToDos);
    }
  };

  const dateFilter = () => {
    if (dateRange?.from && dateRange?.to) {
      const fromDate = new Date(dateRange?.from as Date);
      const toDate = new Date(dateRange?.to as Date);
      const updatedToDos = toDos.filter((item: ToDoState) => {
        const toDoDate = new Date(item.date);

        return toDoDate >= fromDate && toDoDate <= toDate;
      });
      if (updatedToDos !== toDos) {
        setFilteredToDos(updatedToDos);
      }
    }
  };

  const statusFilter = (status: boolean) => {
    const updatedToDos = toDos.filter(
      (item: ToDoState) => item.isChecked === status,
    );
    setFilteredToDos(updatedToDos);
  };

  useEffect(() => {
    dateFilter();
  }, [dateRange]);

  useEffect(() => {
    setFilteredToDos(toDos);
  }, [toDos]);

  useEffect(() => {
    fetchToDoLists();
  }, []);

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
          <ToDoForm
            onSubmit={onSubmit}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            isSubmitSuccessful={isSubmitSuccessful}
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
                          <DropdownMenuItem onSelect={() => statusFilter(true)}>
                            Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => statusFilter(false)}
                          >
                            Incomplete
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => priorityFilter("all")}>
                      Reset Filters
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div
              className="bg-white! dark:bg-[#1e3a5f]! dark:text-white text-sm h-full flex gap-2 cursor-pointer items-center justify-center rounded-md sm:px-3 border-1"
              onClick={() => priorityFilter("all")}
            >
              <CircleCheck size={20} color="#2097f3" />
              {!isSmallScreen && "All"}
            </div>
            <div
              className="bg-white! dark:bg-[#1e3a5f]! dark:text-white h-full text-sm flex items-center cursor-pointer gap-2 justify-center rounded-md sm:px-3 border-1"
              onClick={() => priorityFilter("high")}
            >
              <CircleArrowUp size={20} color="red" />
              {!isSmallScreen && "High"}
            </div>
            <div
              className="bg-white! dark:bg-[#1e3a5f]! h-full text-sm dark:text-white flex items-center cursor-pointer gap-2 justify-center rounded-md sm:px-3 border-1"
              onClick={() => priorityFilter("medium")}
            >
              <CircleEqual size={20} color="orange" />
              {!isSmallScreen && "Medium"}
            </div>
            <div
              className="bg-white! dark:bg-[#1e3a5f]! h-full text-sm flex dark:text-white items-center cursor-pointer gap-2 justify-center rounded-md md:px-3 border-1"
              onClick={() => priorityFilter("low")}
            >
              <CircleArrowDown size={20} color="green" />
              {!isSmallScreen && "Low"}
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 mt-2 p-2 overflow-scroll h-[calc(100%-130px)]">
        {(() => {
          if (filteredToDos) {
            return filteredToDos.map((toDo, index) => (
              <ToDoItem
                key={index}
                data={toDo}
                checkToDo={checkToDo}
                deleteToDo={deleteToDo}
              />
            ));
          }
        })()}
      </div>
    </>
  );
};
