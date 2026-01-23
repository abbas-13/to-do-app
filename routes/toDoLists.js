import ToDoList from "../models/toDoList.js";

export default (app) => {
  app.get("/api/lists", async (req, res) => {
    try {
      const lists = await ToDoList.find();
      res.json(lists);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/lists", async (req, res) => {
    try {
      const { id, name } = req.body;
      const newToDoList = new ToDoList({ id, name });
      await newToDoList.save();
      res.status(201).json({ body: newToDoList });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/lists/:id", async (req, res) => {
    try {
      await ToDoList.findOneAndDelete(req.params.id);
      res.status(200).json({
        message: `List with id: ${req.params.id} deleted successfully`,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
};
