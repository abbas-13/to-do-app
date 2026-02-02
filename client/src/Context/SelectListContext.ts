import { createContext } from "react";

import type { SelectListContextType } from "../assets/Types";

export const SelectListContext = createContext<SelectListContextType>({
  selectList: () => {},
  selectedList: { _id: "", name: "" },
  setSelectedList: () => {},
});
