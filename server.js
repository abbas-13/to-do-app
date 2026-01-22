import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import toDoLists from "./routes/toDoLists";

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MONGODB CONNECTED"))
  .catch((err) => console.log("MONGODB NOT CONNECTED with error: ", err));

const app = express();
const PORT = process.env.PORT || 8000;

toDoLists(app);

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT,
    );
  else console.log("Error occurred, server can't start", error);
});
