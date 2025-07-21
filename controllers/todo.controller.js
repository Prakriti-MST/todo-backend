import Todo from "../models/Todo.model.js";

const addTodo = async (req, res) => {
  try {
    const { title, status = "pending", priority = "mid" } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTodo = new Todo({
      title,
      status,
      priority,
      owner: req.user._id, // 👈 Associate the todo with the logged-in user
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ owner: req.user._id }); // 🔥 filter by current user
    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, priority } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }

    const todo = await Todo.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export { addTodo, getTodos, updateTodo, deleteTodo };
