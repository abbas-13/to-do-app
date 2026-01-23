import mongoose from "mongoose";

const toDoSchema = new mongoose.Schema({
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

const ToDo = mongoose.model("ToDo", toDoSchema);
export default ToDo;
