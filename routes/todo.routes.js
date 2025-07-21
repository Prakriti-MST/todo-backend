
import express from 'express';
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo
} from '../controllers/todo.controller.js';

const todoRouter = express.Router();

// GET    
todoRouter.get('/', getTodos);

// POST   
todoRouter.post('/', addTodo);

// PUT    
todoRouter.put('/:id', updateTodo);

// DELETE 
todoRouter.delete('/:id', deleteTodo);

export default todoRouter;
