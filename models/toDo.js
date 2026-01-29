import mongoose from "mongoose";

const toDoSchema = new mongoose.Schema({
  isChecked: Boolean,
  list: String,
  toDoName: String,
  date: String,
  notes: String,
  time: String,
  priority: String,
  dateCreated: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const ToDo = mongoose.model("ToDo", toDoSchema);
export default ToDo;
