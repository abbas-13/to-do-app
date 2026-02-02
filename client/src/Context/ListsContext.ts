import { createContext } from "react";

import type { ListsContextType } from "../assets/Types";

export const ListsContext = createContext<ListsContextType>({
  lists: [],
  setLists: () => {},
});
