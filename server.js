import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import toDoLists from "./routes/toDoLists.js";
import toDoTasks from "./routes/toDoTasks.js";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000", "https://abbas-todo-app.netlify.app"],
  credentials: true,
  optionsSuccessStatus: 200,
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MONGODB CONNECTED"))
  .catch((err) => console.log("MONGODB NOT CONNECTED with error: ", err));

const PORT = process.env.PORT || 8000;

app.use(cors(corsOptions));

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
