import { useContext, useEffect, useState } from "react";

import { ToDoContext } from "@/Context/ToDoContext";
import type { ToDoFormInput, ToDoState } from "@/assets/Types";
import { ListsContext } from "@/Context/ListsContext";

interface ToDosHolderProps {
  children: React.ReactNode;
}

export const ToDosHolder = ({ children }: ToDosHolderProps) => {
  const [toDos, setToDos] = useState<ToDoState[]>([]);
  const { selectedList } = useContext(ListsContext);

  const fetchToDos = async (id: string) => {
    try {
      const response = await fetch(`/api/toDos/${id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error fetching To Dos: ", await response.json());
      }

      const toDoData = await response.json();
      const sortedToDos = toDoData.sort(
        (a: ToDoState, b: ToDoState) =>
          new Date(a.date).valueOf() - new Date(b.date).valueOf(),
      );

      setToDos(sortedToDos);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error("Fetching To Dos failed: ", errorMessage);
    }
  };

  const checkToDo = async (toDoId: string, isChecked: boolean) => {
    try {
      const response = await fetch(`/api/toDos/${toDoId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isChecked: isChecked }),
      });

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

  const updateToDo = async (toDoId: string, data: ToDoFormInput) => {
    try {
      const response = await fetch(`/api/toDos/${toDoId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      fetchToDos(selectedList._id);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error("PUT failed: ", errorMessage);
    }
  };

  const deleteToDo = async (toDoId: string) => {
    try {
      const response = await fetch(`/api/toDos/${toDoId}`, {
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

      const updatedToDos = toDos.filter((toDo) => toDo._id !== toDoId);
      setToDos(updatedToDos);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error("Delete todo failed: ", errorMessage);
    }
  };

  const createToDo = async (data: ToDoFormInput) => {
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

      const response = await fetch(`/api/toDos`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newToDo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const { body } = await response.json();

      setToDos([...toDos, body]);
    } catch (err) {
      console.log(err instanceof Error ? err.message : "Unkown error occurred");
    }
  };

  useEffect(() => {
    if (selectedList._id.length > 0) {
      fetchToDos(selectedList._id);
    }
  }, [selectedList]);

  return (
    <ToDoContext.Provider
      value={{
        toDos,
        setToDos,
        fetchToDos,
        checkToDo,
        deleteToDo,
        createToDo,
        updateToDo,
      }}
    >
      {children}
    </ToDoContext.Provider>
  );
};
