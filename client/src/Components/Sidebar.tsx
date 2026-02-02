import { useContext, useState } from "react";
import { Menu, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { ToDoList } from "./To-DoList";
import { SearchBar } from "./SearchBar";
import { Button } from "@/Components/ui/button";
import { Sidebar, SidebarContent, useSidebar } from "@/Components/ui/sidebar";
import { ListsContext } from "@/Context/ListsContext";
import { SelectListContext } from "@/Context/SelectListContext";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ListsStateType } from "@/assets/Types";

export const CustomSidebar = () => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState<ListsStateType[]>([]);

  const { lists, setLists } = useContext(ListsContext);
  const { selectList, setSelectedList } = useContext(SelectListContext);
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const addList = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lists`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lists/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const updatedLists = lists.map((list) =>
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lists/${id}`,
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

      const updatedToDoLists = lists.filter((toDoList) => toDoList._id !== id);

      setLists(updatedToDoLists);
      selectList("", "");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error("Delete list failed: ", errorMessage);
    }
  };

  const sideBarContent = () => {
    return (
      <>
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
      </>
    );
  };

  return (
    <>
      {isMobile ? (
        <div className="h-screen flex">
          <div className="pt-6 pl-4 bg-[#F5FAFE]">
            <Sidebar>
              <SidebarContent className="gap-0 w-[230px]!">
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
