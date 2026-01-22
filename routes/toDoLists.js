import toDoList from "../models/toDoList";

export default (app) => {
  app.get("/api/lists", async (req, res) => {
    try {
      const lists = await toDoLists.find();
      res.json(lists);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/lists", async (req, res) => {
    try {
      const { id, name } = req.body;
      const newToDoList = new toDoList({ id, name });
      await newToDoList.save();
      res.status(201).json(newToDoList);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
};
