import express from "express";
import passport from "passport";
import cookieSession from "cookie-session";
import cors from "cors";
import mongoose from "mongoose";

import "dotenv/config";
import "./models/user.js";
import "./services/passport.js";
import toDoLists from "./routes/toDoLists.js";
import toDoTasks from "./routes/toDoTasks.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://abbas-todo-app.netlify.app",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MONGODB CONNECTED"))
  .catch((err) => console.log("MONGODB NOT CONNECTED with error: ", err));

const PORT = process.env.PORT || 8000;

app.use(
  cookieSession({
    maxAge: 1800 * 1000,
    keys: [process.env.COOKIE_KEY],
  }),
);

app.use(passport.initialize());
app.use(passport.session());

authRoutes(app);
toDoLists(app);
toDoTasks(app);

app.get("/health", (req, res) => {
  console.log({ status: "OK", timestamp: new Date() });
  res.json({ status: "OK", timestamp: new Date() });
});

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT,
    );
  else console.log("Error occurred, server can't start", error);
});
