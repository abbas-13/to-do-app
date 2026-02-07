import { useContext, useState } from "react";
import { LogIn, LogOut, Menu, Moon, Plus, Sun } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useTheme } from "@/Components/ui/theme-provider";
import { ToDoList } from "./To-DoList";
import { SearchBar } from "./SearchBar";
import { Button } from "@/Components/ui/button";
import { Sidebar, SidebarContent, useSidebar } from "@/Components/ui/sidebar";
import { ListsContext } from "@/Context/ListsContext";
import { SelectListContext } from "@/Context/SelectListContext";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ListsStateType } from "@/assets/Types";
import { Switch } from "./ui/switch";
import { AuthContext } from "@/Context/AuthContext";

export const CustomSidebar = () => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState<ListsStateType[]>([]);

  const { lists, setLists } = useContext(ListsContext);
  const { selectList, setSelectedList } = useContext(SelectListContext);
  const { user, setUser } = useContext(AuthContext);

  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const addList = async () => {
    try {
      const response = await fetch(`/api/lists`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          toast.error(errorData.error, {
            position: "top-center",
            action: {
              label: "Login",
              onClick: () => navigate("/login"),
            },
          });
        }
      }

      const { body } = await response.json();

      setLists([{ _id: body._id, name: "" }, ...lists]);
      selectList(body._id, "");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error(errorMessage);
    }
  };

  const createList = async (name: string, id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/lists/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const updatedLists = lists.map((list: ListsStateType) =>
        list._id === id ? { ...list, name } : list,
      );

      setLists(updatedLists);
      setSelectedList(updatedLists[0]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error("Create list failed: ", errorMessage);
    }
  };

  const deleteList = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/lists/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const updatedToDoLists = lists.filter(
        (toDoList: ListsStateType) => toDoList._id !== id,
      );

      setLists(updatedToDoLists);
      selectList("", "");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error("Delete list failed: ", errorMessage);
    }
  };

  const toggleTheme = (isChecked: boolean) => {
    const selectedTheme = isChecked ? "light" : "dark";
    setTheme(selectedTheme);
  };

  const logOut = async () => {
    if (user._id?.length > 0) {
      try {
        const response = await fetch(`/api/logout`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setUser({
            _id: "",
            name: "",
            email: "",
            displayName: "",
          });
          setTheme("light");
          navigate("/login");
        } else {
          console.error("Logout failed");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unkown error occurred";
        console.error(errorMessage);
      }
    } else {
      navigate("/login");
    }
  };

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
              className="bg-foreground hover:bg-[#FFFFFF] hover:border-2 hover:border-[#2097f3] active:bg-[#2097f3] active:text-white hover:text-black active:outline-2 active:outline-[#85C7F8] hover:shadow-lg active:shadow-none active:border-1 active:border-white text-white"
              variant="outline"
              onClick={addList}
            >
              Create List
              <Plus strokeWidth={3} />
            </Button>
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
                    event?.stopPropagation();
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
              {user._id?.length > 0 ? (
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
