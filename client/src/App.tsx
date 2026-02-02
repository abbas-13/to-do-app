import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { toast } from "sonner";

import "./App.css";

import { Dashboard } from "@/Components/Dashboard";
import { Appshell } from "@/Components/Appshell";
import { Toaster } from "@/Components/ui/sonner";
import { Login } from "@/Components/Login";
import { AuthContext } from "@/Context/AuthContext";
import { ListsContext } from "@/Context/ListsContext";
import { SelectListContext } from "@/Context/SelectListContext";
import { ThemeProvider } from "@/Components/ui/theme-provider";
import type { ListsStateType, ToDoState, UserType } from "@/assets/Types";

const App = () => {
  const [toDos, setToDos] = useState<ToDoState[]>([]);
  const [lists, setLists] = useState<ListsStateType[]>([]);
  const [selectedList, setSelectedList] = useState<ListsStateType>({
    _id: "",
    name: "",
  });
  const [user, setUser] = useState<UserType>({
    _id: "",
    name: "",
    email: "",
    displayName: "",
  });
  const navigate = useNavigate();

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

  const selectList = (id: string, name?: string) => {
    setSelectedList({ _id: id, name: name ? name : "" });
    fetchToDos(id);
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

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/current_user`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("User not logged in", {
          position: "top-center",
          action: {
            label: "Login",
            onClick: () => navigate("/login"),
          },
        });
        navigate("/login");
      }

      const userData = await response.json();

      setUser(userData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error("An error occurred: ", errorMessage);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <SelectListContext.Provider
        value={{ selectList, selectedList, setSelectedList }}
      >
        <ListsContext.Provider value={{ lists, setLists }}>
          <ThemeProvider defaultTheme="light">
            <Toaster />
            <Routes>
              <Route
                path="/"
                element={
                  <Appshell>
                    <Dashboard
                      fetchToDoLists={fetchToDoLists}
                      toDos={toDos}
                      setToDos={setToDos}
                    />
                  </Appshell>
                }
              />
            </Routes>
            <Routes>
              <Route path="/login" element={<Login />} />
            </Routes>
          </ThemeProvider>
        </ListsContext.Provider>
      </SelectListContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
