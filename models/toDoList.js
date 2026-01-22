import mongoose, { Schema } from "mongoose";

const toDoListSchema = new Schema({
  id: String,
  name: String,
});

mongoose.model("toDoList", toDoListSchema);
