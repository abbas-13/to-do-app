import requireLogin from "../middlewares/requireLogin.js";
import ToDo from "../models/toDo.js";
import ToDoList from "../models/toDoList.js";
import { processTask } from "../services/aiServices.js";

export default (app) => {
  app.post("/api/process-task", requireLogin, async (req, res) => {
    try {
      const newToDoList = new ToDoList({
        userId: req.user._id,
        deleted: false,
      });

      newToDoList.name = req.body.input;
      await newToDoList.save();

      const result = await processTask(req.body.input);

      const tasks = result.subtasks.map((item) => {
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

      try {
        await ToDo.create(tasks);
      } catch (err) {
        console.log(err);
      }

      res.status(201).json({
        message: "List created and parsed successfully.",
        body: {
          tasks,
          toDoList: newToDoList,
        },
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to process task" });
    }
  });
};
