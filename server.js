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
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:8000",
      "https://abbas-todo-app.netlify.app",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  exposedHeaders: ["set-cookie"],
};

app.use(express.json());
app.use(cors(corsOptions));
app.set("trust proxy", 1);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MONGODB CONNECTED"))
  .catch((err) => console.log("MONGODB NOT CONNECTED with error: ", err));

const PORT = process.env.PORT || 8000;

app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 3600 * 1000,
    keys: [process.env.COOKIE_KEY],
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain: "to-do-app-server-jvdr.onrender.com",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  }),
);

app.use((req, res, next) => {
  console.log("=== COOKIE FLOW DEBUG ===");
  console.log("URL:", req.url);
  console.log("Origin:", req.headers.origin);
  console.log("Cookie Header:", req.headers.cookie || "No cookie header");
  console.log("Session ID from request:", req.sessionID);

  const originalSetHeader = res.setHeader;
  res.setHeader = function (name, value) {
    if (name.toLowerCase() === "set-cookie") {
      console.log("=== SETTING COOKIE ===");
      console.log("Cookie value:", value);
    }
    return originalSetHeader.call(this, name, value);
  };

  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session:", req.session);
  console.log("User:", req.user);
  next();
});

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
