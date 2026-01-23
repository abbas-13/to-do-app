import mongoose from "mongoose";

const toDoListSchema = new mongoose.Schema({
  id: String,
  name: String,
});

const ToDoList = mongoose.model("toDoList", toDoListSchema);
export default ToDoList;
