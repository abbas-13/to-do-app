import { useCallback, useEffect, useState } from "react";

import { AuthContext } from "@/Context/AuthContext";
import { useTheme } from "./ui/theme-provider";
import type { UserType } from "@/assets/Types";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const { setTheme } = useTheme();

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch(`/api/current_user`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        setUser(null);
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const userData: UserType = await response.json();
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error("An error occurred: ", errorMessage);
      return null;
    }
  }, []);

  const logOut = async () => {
    try {
      const response = await fetch(`/api/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Logout failed");
        return;
      }

      // Clearing the user is enough: RequireAuth redirects on the next render.
      setUser(null);
      setTheme("light");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      console.error(errorMessage);
    }
  };

  useEffect(() => {
    const init = async () => {
      await refreshUser();
      setLoading(false);
    };

    init();
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, loading, logOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
