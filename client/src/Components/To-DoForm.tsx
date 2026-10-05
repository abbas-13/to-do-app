import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import type { ToDoFormInput, ToDoFormProps } from "@/assets/Types";
import styles from "./To-DoForm.module.css";
import { convertTimeTo24Hour } from "@/lib/utils";

export const ToDoForm = ({
  onSubmit,
  isDialogOpen,
  setIsDialogOpen,
  data,
}: ToDoFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ToDoFormInput>();

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const formattedDate = `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}/${year}`;

  useEffect(() => {
    if (!isDialogOpen) return;

    reset({
      toDoName: data?.toDoName ?? "",
      priority: data?.priority ?? "",
      notes: data?.notes ?? "",
      date: (data?.date ? data.date.substring(0, 10) : "") as unknown as Date,
      time: data?.time ? convertTimeTo24Hour(data.time) : "",
    });
  }, [isDialogOpen, reset, data]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-[380px]! rounded-[10px] md:max-w-[420px]! p-0!"
      >
        <DialogHeader className="pt-4 pl-4 text-left">
          <DialogTitle>{data ? "Edit to-do" : "Describe to-do"}</DialogTitle>
        </DialogHeader>
        <div className="border border-gray-200"></div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles["todo-form"]}>
          <div className="grid grid-cols-[30%_70%] py-2">
            <label className="text-xs font-semibold md:text-sm text-foreground">
              To-Do Name:
            </label>
            <div>
              <Input
                {...register("toDoName", {
                  required: "Please enter to-do name",
                })}
                type="text"
                name="toDoName"
                placeholder="To do name"
                className="text-xs md:text-sm"
              />
              <ErrorMessage
                errors={errors}
                name="toDoName"
                render={({ message }) => (
                  <p className="text-xs text-red-500 mt-1 text-center">
                    {message}
                  </p>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-[30%_70%] py-2">
            <label className="text-xs font-semibold md:text-sm text-foreground">
              Priority:
            </label>
            <div>
              <Controller
                name="priority"
                control={control}
                rules={{ required: "Please select a priority" }}
                render={({ field }) => (
                  <>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="text-xs md:text-sm">
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {[
                            { label: "High", value: "high" },
                            { label: "Medium", value: "medium" },
                            { label: "Low", value: "low" },
                          ].map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      errors={errors}
                      name="priority"
                      render={({ message }) => (
                        <p className="text-xs text-red-500 mt-1 text-center">
                          {message}
                        </p>
                      )}
                    />
                  </>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-[30%_70%] py-2">
            <label className="text-xs font-semibold md:text-sm text-foreground">
              Notes:
            </label>
            <div>
              <Textarea
                placeholder="Notes description"
                {...register("notes")}
                name="notes"
                className="text-xs md:text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-[30%_70%] py-2">
            <label className="text-xs font-semibold md:text-sm text-foreground">
              Date:
            </label>
            <div className="flex gap-2">
              <div>
                <Input
                  {...register("date", {
                    required: "Please select deadline date",
                  })}
                  type="date"
                  name="date"
                  id="finish by"
                  className="text-xs md:text-sm flex-1"
                />
                <ErrorMessage
                  errors={errors}
                  name="date"
                  render={({ message }) => (
                    <p className="text-xs text-red-500 mt-1 text-center">
                      {message}
                    </p>
                  )}
                />
              </div>
              <div>
                <Input
                  {...register("time", {
                    required: "Please select deadline time",
                  })}
                  type="time"
                  name="time"
                  id="finish by"
                  className="text-xs md:text-sm pl-2 pr-1 md:py-1 md:px-3 flex-1"
                  min={formattedDate}
                />
                <ErrorMessage
                  errors={errors}
                  name="time"
                  render={({ message }) => (
                    <p className="text-xs text-red-500 mt-1 text-center">
                      {message}
                    </p>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="border border-gray-200 my-2"></div>
          <div className="grid grid-cols-2 justify-self-end w-1/2 justify-center gap-2 items-center">
            <Button type="submit">Submit</Button>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
