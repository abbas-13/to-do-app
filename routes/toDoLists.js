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
      const newToDoList = new ToDoList({});
      await newToDoList.save();
      res.status(201).json({ body: newToDoList });
    } catch (err) {
      console.error("Error while creating list: ", err);
      res.status(400).json({ error: err.message });
    }
  });

  app.put("/api/lists/:id", async (req, res) => {
    try {
      const updatedToDoList = await ToDoList.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!updatedToDoList) {
        res.status(404).json({ error: "List not found" });
      }

      res.status(200).json({
        message: "List created successfully",
        body: updatedToDoList,
      });
    } catch (err) {
      console.error(err);
    }
  });

  app.delete("/api/lists/:id", async (req, res) => {
    try {
      const deletedList = await ToDoList.findByIdAndDelete(req.params.id);
      console.log(req.params);
      if (!deletedList) {
        return res.status(404).json({ error: "List not found" });
      }

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
