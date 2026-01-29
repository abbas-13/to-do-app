import ToDo from "../models/toDo.js";
import requireLogin from "../middlewares/requireLogin.js";

export default (app) => {
  app.get("/api/toDos/:id", requireLogin, async (req, res) => {
    try {
      const toDos = await ToDo.find({
        list: req.params.id,
        userId: req.user._id,
      });

      if (!toDos) {
        return res.status(404).json({ error: "No ToDos exist" });
      }
      res.status(200).json(toDos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/toDos", requireLogin, async (req, res) => {
    try {
      const newToDo = new ToDo({ ...req.body, userId: req.user._id });
      await newToDo.save();
      res.status(201).json({ body: newToDo });
    } catch (err) {
      console.error("Error while creating to-do: ", err);
      res.status(400).json({ error: err.message });
    }
  });

  app.put("/api/toDos/:id", requireLogin, async (req, res) => {
    try {
      const updatedToDo = await ToDo.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });

      if (!updatedToDo) {
        res.status(404).json({ error: "ToDo not found" });
      }

      updatedToDo.isChecked = req.body.isChecked;
      await updatedToDo.save();

      res.status(200).json({
        message: "ToDo updated successfully",
        body: updatedToDo,
      });
    } catch (err) {
      console.error("Update error", err);
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/toDos/:id", requireLogin, async (req, res) => {
    try {
      const deletedToDo = await ToDo.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id,
      });

      if (!deletedToDo) {
        res.status(404).json({ error: "ToDo not found" });
      }

      res.status(200).json({
        message: "ToDo deleted successfully",
        id: req.params.id,
      });
    } catch (err) {
      console.error("Error while deleting ToDo: ", err);
      res.status(400).json({ error: err.message });
    }
  });
};
