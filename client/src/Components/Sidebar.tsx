import { useContext, useEffect, useState } from "react";
import {
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
  const { lists, selectList, fetchToDoLists, addList, createList, deleteList } =
    useContext(ListsContext);

  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

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
              <div className="flex gap-4 px-4 my-4 justify-center w-full items-center">
                <img style={{ height: "30px" }} src="/check.png" />
                <h1 className="bg-gradient-to-r from-[#2097F3] to-[#60B4F5] bg-clip-text text-transparent text-transparent text-3xl font-semibold">
                  to-do
                </h1>
              </div>
              <div className="border border-gray-200 m-2 mb-4"></div>
            </>
          )}

          <SearchBar
            setSearchResult={setSearchResults}
            lists={lists}
            input={input}
            setInput={setInput}
          />
          <div className="flex my-4 items-center justify-center w-full">
            <Button
              className="w-10/12 bg-foreground hover:bg-[#FFFFFF] hover:border-2 hover:border-[#2097f3] active:bg-[#2097f3] active:text-white hover:text-black active:outline-2 active:outline-[#85C7F8] hover:shadow-lg active:shadow-none active:border-1 active:border-white text-white"
              variant="outline"
              onClick={addList}
            >
              Create List
              <Plus strokeWidth={3} />
            </Button>
          </div>
          <div className="flex my-4 items-center justify-center w-full">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-11/12 bg-foreground hover:bg-[#FFFFFF] hover:border-2 hover:border-[#2097f3] active:bg-[#2097f3] active:text-white hover:text-black active:outline-2 active:outline-[#85C7F8] hover:shadow-lg active:shadow-none active:border-1 active:border-white text-white"
                  variant="outline"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Create Project
                  <Sparkles strokeWidth={2} />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[380px]! rounded-lg md:max-w-[420px]! p-0!">
                <DialogHeader className="pt-4 pl-4 text-left">
                  <DialogTitle>New Project</DialogTitle>
                </DialogHeader>
                <div className="border border-gray-200"></div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid items-center justify-center grid-cols-1 gap-2 p-2 pb-4 px-4"
                >
                  <div className="grid grid-cols-[30%_70%] py-2">
                    <label className="text-xs flex items-center font-semibold md:text-sm dark:text-white">
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
                        className="text-xs md:text-sm dark:text-black dark:bg-gray-200!"
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
                      <Info size={12} color="#a1a1a1" />
                    </div>
                    <p className="text-[10px] text-center flex items-center text-muted-foreground">
                      Enter title and submit to automatically break down project
                      into managable tasks and assign priorities to each
                    </p>
                  </div>
                  <div className="border border-gray-200 my-2"></div>
                  <div className="grid grid-cols-2 justify-self-end w-1/2 justify-center gap-2 items-center">
                    <Button
                      className="bg-[#2097f3] hover:bg-[#FFFFFF] hover:border-2 hover:border-[#2097f3] active:bg-[#2097f3] active:outline-2 active:outline-[#85C7F8] active:text-white hover:text-black hover:shadow-lg active:shadow-none active:border-1 active:border-white text-white"
                      type="submit"
                    >
                      Submit
                    </Button>
                    <DialogClose asChild>
                      <Button className="text-[#2097f3] hover:bg-white hover:shadow-lg active:shadow-none active:outline-2 active:outline-[#85C7F8] bg-white border-2 border-[#2097f3]">
                        Close
                      </Button>
                    </DialogClose>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
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
            <div className="border border-gray-200 m-2"></div>
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
              className="flex justify-between w-full p-2 px-4 mb-2 active:bg-gray-600 rounded-md"
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
              <SidebarContent className="gap-0 w-[230px]! bg-secondary">
                {sideBarContent()}
              </SidebarContent>
            </Sidebar>
            <Menu onClick={toggleSidebar} />
          </div>
        </div>
      ) : (
        <div className="p-2 w-52 bg-secondary border-r-2 border-r-grey-400">
          {sideBarContent()}
        </div>
      )}
    </>
  );
};
