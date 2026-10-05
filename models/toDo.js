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
  completedAt: { type: Date, default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  deleted: { type: Boolean, required: true },
});

const ToDo = mongoose.model("ToDo", toDoSchema);
export default ToDo;
