import { Sidebar } from "./Sidebar.js";

export const Appshell = ({ children }) => {
  return (
    <div className="h-screen flex">
      <Sidebar />
      <main className="flex-1 p-4 overflow-x-hidden">{children}</main>
    </div>
  );
};
