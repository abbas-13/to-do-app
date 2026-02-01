import express from "express";
import passport from "passport";
// import cookieSession from "cookie-session";
import session from "express-session";
import cors from "cors";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

import "dotenv/config";
import "./models/user.js";
import "./services/passport.js";
import toDoLists from "./routes/toDoLists.js";
import toDoTasks from "./routes/toDoTasks.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.set("trust proxy", 1);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MONGODB CONNECTED"))
  .catch((err) => console.log("MONGODB NOT CONNECTED with error: ", err));

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MONGODB CONNECTED");

  app.use(
    session({
      secret: process.env.COOKIE_KEY,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        httpOnly: true,
        maxAge: 24 * 3600 * 1000,
      },
    }),
  );
});

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:8000",
      "https://abbas-todo-app.netlify.app",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 8000;

app.use((req, res, next) => {
  console.log("=== COOKIE FLOW DEBUG ===");
  console.log("URL:", req.url);
  console.log("Origin:", req.headers.origin);
  console.log("Cookie Header:", req.headers.cookie || "No cookie header");
  console.log("Session ID from request:", req.sessionID);

  const originalSetHeader = res.setHeader;
  res.setHeader = function (name, value) {
    if (name.toLowerCase() === "set-cookie") {
      console.log("Cookie value:", value);
    }
    return originalSetHeader.call(this, name, value);
  };

  next();
});

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
  res.json({ status: "OK", timestamp: new Date() });
});

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT,
    );
  else console.log("Error occurred, server can't start", error);
});
