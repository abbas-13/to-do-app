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
import { AuthHolder } from "./Components/AuthHolder";

const App = () => {
  return (
    <AuthHolder>
      <ListsHolder>
        <ToDosHolder>
          <ThemeProvider defaultTheme="light">
            <Toaster />
            <Routes>
              <Route
                path="/"
                element={
                  <Appshell>
                    <Dashboard />
                  </Appshell>
                }
              />
            </Routes>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </ThemeProvider>
        </ToDosHolder>
      </ListsHolder>
    </AuthHolder>
  );
};

export default App;
