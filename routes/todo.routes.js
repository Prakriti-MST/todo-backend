import express from "express";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.controller.js";

const todoRouter = express.Router();

todoRouter.get("/", getTodos);

todoRouter.post("/", addTodo);

todoRouter.put("/:id", updateTodo);

todoRouter.delete("/:id", deleteTodo);

export default todoRouter;
