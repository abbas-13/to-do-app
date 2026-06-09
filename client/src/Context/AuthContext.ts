import { createContext } from "react";

import type { UserContextType } from "@/assets/Types";

export const AuthContext = createContext<UserContextType>({
  user: null,
  logOut: () => {},
});
