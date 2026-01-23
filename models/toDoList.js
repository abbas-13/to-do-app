import mongoose from "mongoose";

const toDoListSchema = new mongoose.Schema({
  id: String,
  name: String,
});

const ToDoList = mongoose.model("ToDoList", toDoListSchema);
export default ToDoList;
