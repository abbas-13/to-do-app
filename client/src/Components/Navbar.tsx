import { useContext } from "react";
import { useNavigate } from "react-router";
import { CircleUserRound, LogIn, LogOut, Moon, Sun } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Avatar } from "@/Components/ui/avatar";
import { Switch } from "@/Components/ui/switch";
import { useTheme } from "@/Components/ui/theme-provider";
import { AuthContext } from "@/Context/AuthContext";

export const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

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

  const toggleTheme = (isChecked: boolean) => {
    const selectedTheme = isChecked ? "light" : "dark";
    setTheme(selectedTheme);
  };

  return (
    <div className="flex justify-between h-[54px] p-6 bg-secondary border-b-2 border-b-grey-400 items-center">
      <div className="flex gap-4 items-center">
        <img style={{ height: "30px" }} src="/check.png" />
        <h1 className="bg-gradient-to-r from-[#2097F3] to-[#60B4F5] bg-clip-text text-transparent text-transparent text-3xl font-semibold">
          to-do
        </h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex gap-2 items-center">
            <h4 className="scroll-m-20 text-lg font-medium tracking-tight">
              {user.name}
            </h4>
            <Avatar className="flex justify-center items-center border-2">
              <CircleUserRound size={26} />
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem onClick={logOut}>
              {user._id?.length > 0 ? (
                <div className="flex justify-between w-full items-center">
                  Logout
                  <LogOut size={20} />
                </div>
              ) : (
                <div className="flex justify-between w-full items-center">
                  Login
                  <LogIn size={20} />
                </div>
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <div className="flex justify-between w-full">
                <div>Theme</div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex justify-around text-xs gap-2 items-center"
                >
                  <Moon size={18} />
                  <Switch
                    checked={theme === "light" ? true : false}
                    onCheckedChange={(checked) => {
                      event?.stopPropagation();
                      toggleTheme(checked);
                    }}
                  />
                  <Sun size={18} />
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
