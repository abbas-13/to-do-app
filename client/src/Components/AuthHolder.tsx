import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { AuthContext } from "@/Context/AuthContext";
import { useTheme } from "./ui/theme-provider";
import type { UserType } from "@/assets/Types";

interface AuthHolderProps {
  children: React.ReactNode;
}
export const AuthHolder = ({ children }: AuthHolderProps) => {
  const [user, setUser] = useState<UserType | null>(null);

  const navigate = useNavigate();
  const { setTheme } = useTheme();

  const logOut = async () => {
    if (user) {
      try {
        const response = await fetch(`/api/logout`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setUser({
            _id: "",
            name: "",
            email: "",
            displayName: "",
          });
          setTheme("light");
          navigate("/login");
        } else {
          console.error("Logout failed");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unkown error occurred";
        console.error(errorMessage);
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
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

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
