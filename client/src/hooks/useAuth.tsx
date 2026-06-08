import { useContext } from "react";
import { useNavigate } from "react-router";

import { useTheme } from "@/Components/ui/theme-provider";
import { AuthContext } from "@/Context/AuthContext";

export const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const { setTheme } = useTheme();

  const navigate = useNavigate();

  const logOut = async () => {
    if (user._id?.length > 0) {
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

  return { logOut };
};
