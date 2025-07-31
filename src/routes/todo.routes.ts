import express from "express";

import {
  addTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} from "../controllers/todos/index";

const todoRouter = express.Router();

todoRouter.get("/", getTodos);

todoRouter.post("/", addTodo);

todoRouter.put("/:id", updateTodo);

todoRouter.delete("/:id", deleteTodo);

export default todoRouter;
