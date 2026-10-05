import { useContext, useEffect, useRef, useState } from "react";
import {
  LayoutGrid,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Plus,
  Sun,
  Sparkles,
  Info,
} from "lucide-react";

import { ListsContext } from "@/Context/ListsContext";
import { AuthContext } from "@/Context/AuthContext";
import { ToDoList } from "./To-DoList";
import { SearchBar } from "./SearchBar";
import { Logo } from "./Logo";
import { Switch } from "./ui/switch";
import { Button } from "@/Components/ui/button";
import { Sidebar, SidebarContent, useSidebar } from "@/Components/ui/sidebar";
import { useTheme } from "@/Components/ui/theme-provider";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

import type { ListsStateType } from "@/assets/Types";
import { ErrorMessage } from "@hookform/error-message";
import { Input } from "./ui/input";
import { useForm, type SubmitHandler } from "react-hook-form";

export interface ProjectFormInput {
  projectName: string;
}

const MIN_SIDEBAR_WIDTH = 208;
const MAX_SIDEBAR_WIDTH = 420;
const SIDEBAR_WIDTH_KEY = "todo-sidebar-width";

export const CustomSidebar = () => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState<ListsStateType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormInput>();

  const { user, logOut } = useContext(AuthContext);
  const {
    lists,
    selectedList,
    selectList,
    fetchToDoLists,
    addList,
    createList,
    deleteList,
  } = useContext(ListsContext);

  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  // Desktop-only resizable sidebar. Current width (208px) is the minimum.
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    const stored = Number(window.localStorage.getItem(SIDEBAR_WIDTH_KEY));
    return Number.isFinite(stored) && stored >= MIN_SIDEBAR_WIDTH
      ? Math.min(stored, MAX_SIDEBAR_WIDTH)
      : MIN_SIDEBAR_WIDTH;
  });
  const [isResizing, setIsResizing] = useState(false);
  const widthRef = useRef(sidebarWidth);
  widthRef.current = sidebarWidth;

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_WIDTH_KEY, String(sidebarWidth));
  }, [sidebarWidth]);

  const startResize = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = widthRef.current;
    setIsResizing(true);

    const onMove = (moveEvent: PointerEvent) => {
      const next = Math.min(
        MAX_SIDEBAR_WIDTH,
        Math.max(MIN_SIDEBAR_WIDTH, startWidth + (moveEvent.clientX - startX)),
      );
      setSidebarWidth(next);
    };

    const onUp = () => {
      setIsResizing(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const resetSidebarWidth = () => setSidebarWidth(MIN_SIDEBAR_WIDTH);

  const toggleTheme = (isChecked: boolean) => {
    const selectedTheme = isChecked ? "light" : "dark";
    setTheme(selectedTheme);
  };

  const processTask = async (input: string) => {
    try {
      const response = await fetch("/api/process-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      return response.json();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error("Fetching To Dos failed: ", errorMessage);
    }
  };

  const onSubmit: SubmitHandler<ProjectFormInput> = async (data) => {
    try {
      const response = await processTask(data.projectName);

      selectList(response.body.toDoList._id, response.body.toDoList.name);
      fetchToDoLists();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unable to process task";
      console.error(errorMessage);
    } finally {
      reset();
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    if (lists.length < 1) {
      fetchToDoLists();
    }
  }, []);

  const sideBarContent = () => {
    return (
      <div className="h-full flex justify-between flex-col">
        <div>
          {isMobile && (
            <>
              <div className="flex px-4 my-4 justify-center w-full items-center">
                <Logo size={28} wordmarkClassName="text-bone" />
              </div>
              <div className="border-t border-sidebar-border m-2 mb-4"></div>
            </>
          )}

          <SearchBar
            setSearchResult={setSearchResults}
            lists={lists}
            input={input}
            setInput={setInput}
          />
          <div className="flex my-4 items-center justify-center w-full">
            <Button className="w-10/12" variant="secondary" onClick={addList}>
              Create List
              <Plus strokeWidth={2.5} />
            </Button>
          </div>
          <div className="flex my-4 items-center justify-center w-full">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-10/12"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Plan With AI
                  <Sparkles strokeWidth={2} />
                </Button>
              </DialogTrigger>
              <DialogContent
                aria-describedby={undefined}
                className="max-w-[380px]! rounded-[10px] md:max-w-[420px]! p-0!"
              >
                <DialogHeader className="pt-4 pl-4 text-left">
                  <DialogTitle>New Project</DialogTitle>
                </DialogHeader>
                <div className="border-t border-border"></div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid items-center justify-center grid-cols-1 gap-2 p-2 pb-4 px-4"
                >
                  <div className="grid grid-cols-[30%_70%] py-2">
                    <label className="text-xs flex items-center font-semibold md:text-sm text-heather">
                      Project Title:
                    </label>
                    <div>
                      <Input
                        {...register("projectName", {
                          required: "Please enter project name",
                        })}
                        type="text"
                        autoComplete="off"
                        name="projectName"
                        placeholder="Project name"
                        className="text-xs md:text-sm"
                      />
                      <ErrorMessage
                        errors={errors}
                        name="projectName"
                        render={({ message }) => (
                          <p className="text-xs text-red-500 mt-1 text-center">
                            {message}
                          </p>
                        )}
                      />
                    </div>
                  </div>
                  <div className="w-full mt-2 flex justify-center">
                    <div className="p-[2px]">
                      <Info size={12} className="text-dusty-mauve" />
                    </div>
                    <p className="text-[10px] text-center flex items-center text-muted-foreground">
                      Enter title and submit to automatically break down project
                      into managable tasks and assign priorities to each
                    </p>
                  </div>
                  <div className="border-t border-border my-2"></div>
                  <div className="grid grid-cols-2 justify-self-end w-1/2 justify-center gap-2 items-center">
                    <Button type="submit">Submit</Button>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <button
            type="button"
            onClick={() => {
              selectList("", "");
              if (isMobile) toggleSidebar();
            }}
            className={`mx-2 flex items-center gap-2 rounded-[10px] px-2 py-2 text-sm font-medium transition-colors ${
              !selectedList._id
                ? "bg-sidebar-accent text-magenta"
                : "text-bone hover:bg-sidebar-accent/60"
            }`}
          >
            <LayoutGrid size={16} />
            Overview
          </button>

          <div className="mx-2 my-2 border-t border-sidebar-border/60"></div>

          {input?.length
            ? searchResults?.map((item) => (
                <ToDoList
                  key={item._id}
                  list={item}
                  createList={createList}
                  deleteList={deleteList}
                />
              ))
            : lists?.map((list: ListsStateType) => (
                <ToDoList
                  key={list._id}
                  list={list}
                  createList={createList}
                  deleteList={deleteList}
                />
              ))}
        </div>
        {isMobile && (
          <div>
            <div className="border-t border-sidebar-border m-2"></div>
            <div className="flex justify-between w-full p-2 px-4 mb-2">
              <div>Theme</div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="flex justify-around text-xs gap-2 items-center"
              >
                <Moon size={18} />
                <Switch
                  checked={theme === "light" ? true : false}
                  onCheckedChange={(checked) => {
                    toggleTheme(checked);
                  }}
                />
                <Sun size={18} />
              </div>
            </div>
            <div
              onClick={logOut}
              className="flex justify-between w-full p-2 px-4 mb-2 cursor-pointer rounded-[10px] hover:bg-sidebar-accent"
            >
              {user ? (
                <div className="flex justify-between w-full items-center">
                  Logout
                  <LogOut size={20} />
                </div>
              ) : (
                <div className="flex justify-between w-full items-center">
                  Login
                  <LogIn size={20} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isMobile ? (
        <div className="h-screen flex">
          <div className="pt-6 pl-4 bg-background">
            <Sidebar>
              <SidebarContent className="gap-0 w-[230px]! bg-sidebar text-sidebar-foreground">
                {sideBarContent()}
              </SidebarContent>
            </Sidebar>
            <Menu onClick={toggleSidebar} />
          </div>
        </div>
      ) : (
        <div
          style={{ width: `${sidebarWidth}px` }}
          className="relative shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
        >
          <div className="flex h-full flex-col overflow-y-auto p-2">
            {sideBarContent()}
          </div>
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
            onPointerDown={startResize}
            onDoubleClick={resetSidebarWidth}
            className={`absolute inset-y-0 right-0 z-20 w-1.5 translate-x-1/2 cursor-col-resize select-none before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:transition-colors ${
              isResizing
                ? "before:bg-magenta"
                : "before:bg-transparent hover:before:bg-magenta/60"
            }`}
          />
        </div>
      )}
    </>
  );
};
