import mongoose, { Schema } from "mongoose";

const toDoSchema = new Schema({
  id: String,
  isChecked: Boolean,
  list: String,
  toDoName: String,
  date: String,
  notes: String,
  time: String,
  priority: String,
  dateCreated: String,
});

mongoose.model("toDo", userSchema);
