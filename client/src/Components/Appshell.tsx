import { useState } from "react";

import { Navbar } from "./Navbar";
import { CustomSidebar } from "./Sidebar";
import { SidebarProvider } from "@/Components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import styles from "./Appshell.module.css";

interface AppShellProps {
  children: React.ReactNode;
}

export const Appshell = ({ children }: AppShellProps) => {
  const isSmallScreen = useIsMobile();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      {!isSmallScreen && <Navbar />}
      <div className={styles["appshell"]}>
        <SidebarProvider
          className="h-full min-h-full"
          open={open}
          onOpenChange={setOpen}
        >
          <CustomSidebar />
          <main className={styles["children-container"]}>{children}</main>
        </SidebarProvider>
      </div>
    </>
  );
};
