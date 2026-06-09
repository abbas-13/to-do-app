import { createContext } from "react";

import type { TToDoContext } from "@/assets/Types";

export const ToDoContext = createContext<TToDoContext>({
  toDos: [],
  setToDos: () => {},
  fetchToDos: () => {},
  checkToDo: () => {},
  deleteToDo: () => {},
  createToDo: () => {},
  updateToDo: () => {},
});
