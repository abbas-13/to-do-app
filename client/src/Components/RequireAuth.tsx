import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { Loader2 } from "lucide-react";

import { AuthContext } from "@/Context/AuthContext";

export const RequireAuth = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-magenta" size={32} />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
