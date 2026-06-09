import { createContext } from "react";

import type { ListsContextType } from "../assets/Types";

export const ListsContext = createContext<ListsContextType>({
  lists: [],
  setLists: () => {},
  selectList: () => {},
  selectedList: { _id: "", name: "" },
  setSelectedList: () => {},
  fetchToDoLists: () => {},
  addList: () => {},
  createList: () => {},
  deleteList: () => {},
});
