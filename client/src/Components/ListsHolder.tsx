import { useState } from "react";

import { ListsContext } from "@/Context/ListsContext";
import type { ListsStateType } from "@/assets/Types";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface ListsHolderProps {
  children: React.ReactNode;
}

export const ListsHolder = ({ children }: ListsHolderProps) => {
  const [lists, setLists] = useState<ListsStateType[]>([]);
  const [selectedList, setSelectedList] = useState<ListsStateType>({
    _id: "",
    name: "",
  });

  const navigate = useNavigate();

  const selectList = (id: string, name?: string) => {
    setSelectedList({ _id: id, name: name ? name : "" });
  };

  const fetchToDoLists = async () => {
    try {
      const response = await fetch(`/api/lists`, {
        method: "GET",
        credentials: "include",
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
        throw new Error(await response.json());
      }

      const toDoLists = await response.json();
      setLists(
        toDoLists.map((item: ListsStateType) => {
          return { _id: item._id, name: item.name };
        }),
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error("Error while fetching lists: ", errorMessage);
    }
  };

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

  const createList = async (name: string, id: string) => {
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

  const deleteList = async (id: string) => {
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

      fetchToDoLists();
      selectList("", "");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error("Delete list failed: ", errorMessage);
    }
  };

  return (
    <ListsContext.Provider
      value={{
        lists,
        setLists,
        selectList,
        selectedList,
        setSelectedList,
        fetchToDoLists,
        addList,
        createList,
        deleteList,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
};
