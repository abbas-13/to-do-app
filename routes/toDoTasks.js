import ToDo from "../models/toDo.js";

export default (app) => {
  app.get("/api/toDos/:id", async (req, res) => {
    try {
      const toDos = await ToDo.find({ list: req.params.id });

      if (!toDos) {
        return res.status(404).json({ error: "ToDo not found" });
      }
      res.status(200).json(toDos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/toDos", async (req, res) => {
    try {
      const newToDo = new ToDo(req.body);
      await newToDo.save();
      res.status(201).json({ body: newToDo });
    } catch (err) {
      console.error("Error while creating to-do: ", err);
      res.status(400).json({ error: err.message });
    }
  });

  app.put("/api/toDos/:id", async (req, res) => {
    try {
      const { isChecked } = req.body;
      const updatedToDo = await ToDo.findByIdAndUpdate(
        req.params.id,
        { isChecked },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!updatedToDo) {
        res.status(404).json({ error: "ToDo not found" });
      }

      res.status(200).json({
        message: "ToDo updated successfully",
        body: updatedToDo,
      });
    } catch (err) {
      console.error("Update error", err);
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/toDos/:id", async (req, res) => {
    try {
      const deletedToDo = await ToDo.findByIdAndDelete(req.params.id);

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
