import { useContext, useState } from "react";
import { X } from "lucide-react";

import { SelectListContext } from "@/Context/SelectListContext";
import { useSidebar } from "@/Components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ToDoListProps } from "@/assets/Types";

export const ToDoList = ({ list, deleteList, createList }: ToDoListProps) => {
  const { selectList } = useContext(SelectListContext);
  const [inputValue, setInputValue] = useState(list.name || "");
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

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
        className="flex max-w-fit gap-1 m-2 items-center"
      >
        <div
          className="w-6/7 p-2 focus-within:border-b-1 focus-within:border-b-[#2097F3] cursor-pointer"
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
            className={`focus:outline-none w-full border-none bg-transparent text-black dark:text-white ${
              list.name?.length > 1 ? "pointer-events-none" : ""
            }`}
          />
        </div>
        <X
          onClick={(event) => {
            event.stopPropagation();
            deleteList(list._id);
          }}
          color="red"
          strokeWidth={4}
          size={20}
          style={{ cursor: "pointer" }}
        />
      </form>
      <div className="border border-gray-200 m-2"></div>
    </>
  );
};
