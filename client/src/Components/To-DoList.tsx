import { useContext, useState } from "react";
import { X } from "lucide-react";

import { useSidebar } from "@/Components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ToDoListProps } from "@/assets/Types";
import { ListsContext } from "@/Context/ListsContext";

export const ToDoList = ({ list, deleteList, createList }: ToDoListProps) => {
  const { selectList, selectedList } = useContext(ListsContext);
  const [inputValue, setInputValue] = useState(list.name || "");
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

  const isActive = selectedList?._id === list._id;

  const handleListNameChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          createList(inputValue, list._id);
        }}
        className={`group flex items-center gap-1 rounded-[10px] mx-2 px-2 py-1 transition-colors ${
          isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/60"
        }`}
      >
        <div
          className="min-w-0 flex-1 py-1 cursor-pointer"
          onClick={() => {
            if (list?.name) {
              selectList(list._id, list?.name);
            }
            if (isMobile && list?.name) {
              toggleSidebar();
            }
          }}
        >
          <input
            id="standard-basic"
            onChange={(event) => handleListNameChange(event)}
            placeholder="List name..."
            disabled={list.name?.length > 1}
            value={inputValue}
            className={`w-full border-none bg-transparent focus:outline-none placeholder:text-fog ${
              isActive ? "text-magenta" : "text-bone"
            } ${list.name?.length > 1 ? "pointer-events-none" : ""}`}
          />
        </div>
        <X
          onClick={(event) => {
            event.stopPropagation();
            deleteList(list._id);
          }}
          className="shrink-0 cursor-pointer text-destructive/70 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
          strokeWidth={2.5}
          size={16}
        />
      </form>
      <div className="mx-2 border-t border-sidebar-border/60"></div>
    </>
  );
};
