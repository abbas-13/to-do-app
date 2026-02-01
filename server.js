import express from "express";
import passport from "passport";
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

mongoose.connect(process.env.MONGO_URI).then(console.log("MONGODB CONNECTED"));

app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
    cookie: {
      secure: "auto",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      maxAge: 24 * 3600 * 1000,
      domain: process.env.NODE_ENV === "production" ? ".onrender.com" : "",
    },
  }),
);

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

const PORT = process.env.PORT || 8000;

app.use(passport.initialize());
app.use(passport.session());

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
