import ToDoList from "../models/toDoList.js";
import requireLogin from "../middlewares/requireLogin.js";

export default (app) => {
  app.get("/api/lists", requireLogin, async (req, res) => {
    try {
      const lists = await ToDoList.find({
        userId: req.user._id,
        deleted: false,
      });
      res.json(lists);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/lists", requireLogin, async (req, res) => {
    try {
      const newToDoList = new ToDoList({
        userId: req.user._id,
        deleted: false,
      });
      await newToDoList.save();
      res.status(201).json({ body: newToDoList });
    } catch (err) {
      console.error("Error while creating list: ", err);
      res.status(400).json({ error: err.message });
    }
  });

  app.put("/api/lists/:id", requireLogin, async (req, res) => {
    try {
      const toDoList = await ToDoList.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });

      if (!toDoList) {
        res.status(400).json({ error: "List not found" });
      }
      toDoList.name = req.body.name;
      await toDoList.save();

      res.status(200).json({
        message: "List created successfully",
        body: toDoList,
      });
    } catch (err) {
      console.error(err);
    }
  });

  app.delete("/api/lists/:id", requireLogin, async (req, res) => {
    try {
      const deletedList = await ToDoList.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });

      if (!deletedList) {
        return res.status(404).json({ error: "List not found" });
      }

      deletedList.deleted = true;
      await deletedList.save();

      res.status(200).json({
        message: `List deleted successfully`,
        id: req.params.id,
      });
    } catch (err) {
      console.error("Error while deleting list: ", err);
      res.status(400).json({ error: err.message });
    }
  });
};
