import { Routes, Route } from "react-router";

import "./App.css";

import { Dashboard } from "@/Components/Dashboard";
import { Appshell } from "@/Components/Appshell";
import { Toaster } from "@/Components/ui/sonner";
import { Login } from "@/Components/Login";
import { ThemeProvider } from "@/Components/ui/theme-provider";
import { SignUp } from "./Components/SignUp";
import { ListsHolder } from "./Components/ListsHolder";
import { ToDosHolder } from "./Components/ToDosHolder";
import { AuthProvider } from "./Components/AuthProvider";
import { RequireAuth } from "./Components/RequireAuth";

const App = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <Toaster />
        <Routes>
          {/* Public / unauthenticated routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes: the guard renders <Outlet /> only when authed */}
          <Route element={<RequireAuth />}>
            <Route element={<ListsHolder />}>
              <Route element={<ToDosHolder />}>
                <Route
                  path="/"
                  element={
                    <Appshell>
                      <Dashboard />
                    </Appshell>
                  }
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
