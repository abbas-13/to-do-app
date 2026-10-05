import {
  Trash,
  CalendarDays,
  Clock,
  EllipsisVertical,
  Pencil,
} from "lucide-react";

import { Checkbox } from "@/Components//ui/checkbox";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/Components/ui/menubar";

import type { ToDoFormInput, ToDoItemProps } from "@/assets/Types";
import styles from "./To-DoItem.module.css";
import { useContext, useState } from "react";
import { type SubmitHandler } from "react-hook-form";
import { ToDoForm } from "./To-DoForm";
import { ToDoContext } from "@/Context/ToDoContext";

export const ToDoItem = ({ data }: ToDoItemProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const { checkToDo, deleteToDo, updateToDo } = useContext(ToDoContext);

  const priorityColour = () => {
    switch (data.priority) {
      case "high":
        return "bg-magenta/25 text-foreground";
      case "medium":
        return "bg-amber/50 text-foreground";
      case "low":
        return "bg-lavender-smoke/20 text-foreground";
      default:
        return "bg-transparent";
    }
  };

  const onSubmit: SubmitHandler<ToDoFormInput> = async (editedData) => {
    try {
      updateToDo(data._id, editedData);
      setIsDialogOpen(false);
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-between rounded-[10px] border border-border bg-card px-4 py-3 transition-colors hover:bg-petal dark:hover:bg-accent">
        <div className="grid w-[60%] md:min-w-[75%] lg:min-w-[80%]">
          <div className="flex items-center gap-2 h-full">
            <Checkbox
              className="rounded-[6px]"
              checked={data.isChecked}
              onCheckedChange={(checked: boolean) =>
                checkToDo(data._id, checked)
              }
            />

            <p
              className={`leading-7 font-semibold text-foreground ${
                data.isChecked && "line-through text-muted-foreground"
              }`}
            >
              {data.toDoName}
            </p>
            <div
              className={`rounded-full text-xs px-2 py-0.5 font-medium ${priorityColour()}`}
            >
              <p>{data.priority}</p>
            </div>
          </div>
          <p
            className={`leading-7 text-xs ml-6 max-w-[180px] md:min-w-full text-muted-foreground ${
              data.isChecked && "text-muted-foreground/70"
            }`}
          >
            {data.notes}
          </p>
        </div>
        <div className="flex flex-col gap-1 pr-2">
          <label
            className={`ml-2 text-xs sm:text-xs flex items-center gap-2 whitespace-nowrap text-muted-foreground ${
              data.isChecked && "text-muted-foreground/70"
            }`}
          >
            <CalendarDays size={12} />
            {new Date(data.date).toISOString().substring(0, 10)}
          </label>
          <label
            className={`ml-2 text-xs sm:text-xs flex items-center gap-2 whitespace-nowrap text-muted-foreground ${
              data.isChecked && "text-muted-foreground/70"
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
                    className="flex justify-between"
                    onClick={() => {
                      deleteToDo(data._id);
                    }}
                  >
                    Delete
                    <Trash size={18} color="#b42318" />
                  </MenubarItem>
                  <MenubarItem
                    className="flex justify-between"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Edit
                    <Pencil size={18} color="#e57cd8" />
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
          <ToDoForm
            onSubmit={onSubmit}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            data={data}
          />
        </div>
      </div>
    </>
  );
};
