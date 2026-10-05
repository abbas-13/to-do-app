import { useContext } from "react";
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
import { Logo } from "@/Components/Logo";

export const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const { theme, setTheme } = useTheme();

  const toggleTheme = (isChecked: boolean) => {
    const selectedTheme = isChecked ? "light" : "dark";
    setTheme(selectedTheme);
  };

  return (
    <div className="flex items-center justify-between h-[54px] px-6 bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
      <Logo size={28} wordmarkClassName="text-bone" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex gap-2 items-center cursor-pointer">
            <h4 className="scroll-m-20 text-lg font-medium tracking-tight text-bone">
              {user?.name}
            </h4>
            <Avatar className="flex justify-center items-center border border-bone/30 text-bone">
              <CircleUserRound size={26} />
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem onClick={logOut}>
              {user ? (
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
