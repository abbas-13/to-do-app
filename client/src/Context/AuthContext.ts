import { createContext } from "react";

import type { UserContextType } from "@/assets/Types";

export const AuthContext = createContext<UserContextType>({
  user: {
    _id: "",
    name: "",
    email: "",
    displayName: "",
  },
  setUser: () => {},
});
