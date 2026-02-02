import { Trash, CalendarDays, Clock, EllipsisVertical } from "lucide-react";

import { Checkbox } from "@/Components//ui/checkbox";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/Components/ui/menubar";
import type { ToDoItemProps } from "@/assets/Types";
import styles from "./To-DoItem.module.css";

export const ToDoItem = ({ data, checkToDo, deleteToDo }: ToDoItemProps) => {
  const priorityColour = () => {
    switch (data.priority) {
      case "high":
        return "bg-red-200";
      case "medium":
        return "bg-yellow-300";
      case "low":
        return "bg-green-200";
      default:
        return "bg-transparent";
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="grid w-[60%] md:min-w-[75%] lg:min-w-[80%]">
          <div className="flex items-center gap-2 h-full">
            <Checkbox
              className="data-[state=checked]:border-2 data-[state=checked]:border-white data-[state=checked]:outline-1 rounded-[8px] data-[state=checked]:bg-[#2097f3] data-[state=checked]:text-transparent dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
              checked={data.isChecked}
              onCheckedChange={(checked: boolean) =>
                checkToDo(data._id, checked)
              }
            />

            <p
              className={`leading-7 font-semibold text-black dark:text-primary ${
                data.isChecked && "line-through text-[#A9A9A9]"
              }`}
            >
              {data.toDoName}
            </p>
            <div className={`rounded-sm text-sm px-2 ${priorityColour()}`}>
              <p>{data.priority}</p>
            </div>
          </div>
          <p
            className={`leading-7 text-black dark:text-primary text-xs ml-6 max-w-[180px] md:min-w-full ${
              data.isChecked && "text-[#A9A9A9]"
            }`}
          >
            {data.notes}
          </p>
        </div>
        <div className="flex flex-col gap-1 pr-2">
          <label
            className={`ml-2 text-xs sm:text-xs flex items-center gap-2 text-black dark:text-primary ${
              data.isChecked && "text-[#A9A9A9]"
            }`}
          >
            <CalendarDays size={12} />
            {new Date(data.date).toISOString().substring(0, 10)}
          </label>
          <label
            className={`ml-2 text-xs sm:text-xs flex items-center gap-2 text-black dark:text-primary ${
              data.isChecked && "text-[#A9A9A9]"
            }`}
          >
            <Clock size={12} /> {data.time}
          </label>
          <div>
            <Menubar className="shadow-none p-0 border-none bg-transparent h-auto justify-self-end max-w-max">
              <MenubarMenu>
                <MenubarTrigger className="p-0">
                  <EllipsisVertical
                    size={14}
                    className="text-black dark:text-primary"
                  />
                </MenubarTrigger>
                <MenubarContent align="end" className={styles.MenubarContent}>
                  <MenubarItem
                    className="flex justify-between dark:text-background"
                    onClick={() => {
                      deleteToDo(data._id);
                    }}
                  >
                    Delete
                    <Trash size={18} color="red" />
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
      <div className="border border-gray-200 m-2"></div>
    </>
  );
};
