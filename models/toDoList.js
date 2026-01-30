import mongoose from "mongoose";

const toDoListSchema = new mongoose.Schema({
  name: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  deleted: { type: Boolean, required: true },
});

const ToDoList = mongoose.model("ToDoList", toDoListSchema);
export default ToDoList;
