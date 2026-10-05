import requireLogin from "../middlewares/requireLogin.js";
import ToDo from "../models/toDo.js";
import ToDoList from "../models/toDoList.js";
import { processTask } from "../services/aiServices.js";

export default (app) => {
  app.post("/api/process-task", requireLogin, async (req, res) => {
    try {
      // Run the AI breakdown first so we don't persist an empty list if it fails.
      const result = await processTask(req.body.input);

      const newToDoList = new ToDoList({
        userId: req.user._id,
        deleted: false,
      });

      newToDoList.name = result.title || req.body.input;
      await newToDoList.save();

      const subtasks = Array.isArray(result.subtasks) ? result.subtasks : [];

      const tasks = subtasks.map((item) => {
        return {
          userId: req.user._id,
          list: newToDoList._id,
          toDoName: item.title,
          date: item.deadlineDate,
          time: item.deadlineTime,
          dateCreated: item.dateCreated,
          priority: item.priority,
          deleted: false,
        };
      });

      if (tasks.length > 0) {
        await ToDo.create(tasks);
      }

      res.status(201).json({
        message: "List created and parsed successfully.",
        body: {
          tasks,
          toDoList: newToDoList,
        },
      });
    } catch (err) {
      console.error("process-task failed: ", err);
      res.status(500).json({ error: "Failed to process task" });
    }
  });
};
