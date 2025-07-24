import Todo from "../models/Todo.model.js";

import { sendResponse } from "../utils/response.js";
import { createTodoSchema } from "../models/validators/Todo.zod.js";
import { StatusCodes } from "../utils/constants/statusCodes/statusCode.js";
import { COMMON, TODO } from "../utils/constants/messages/index.js";

const addTodo = async (req, res) => {
  try {
    const todoData = {
      ...req.body,
      owner: req.user._id.toString(),
    };

    const parsed = createTodoSchema.safeParse(todoData);

    if (!parsed.success) {
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: COMMON.VALIDATION_FAILED,
        data: parsed.error.flatten(),
      });
    }

    const newTodo = await Todo.create(parsed.data);

    return sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: TODO.TODO_ADD_SUCCESS,
      data: newTodo,
    });
  } catch (error) {
    // console.error("Error adding todo:", error);
    return sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: TODO.TODO_ADD_FAIL,
      data: [],
    });
  }
};

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ owner: req.user._id });
    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: TODO.TODO_FETCH_SUCCESS,
      data: todos,
    });
  } catch (error) {
    // console.error("Error fetching todos:", error);
    return sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: TODO.TODO_FETCH_FAIL,
      data: [],
    });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;

    if (Object.keys(updates).length === 0) {
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: TODO.TODO_NO_UPDATE_FIELDS,
        data: [],
      });
    }

    const todo = await Todo.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!todo) {
      return sendResponse(res, {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: TODO.TODO_NOT_FOUND,
        data: null,
      });
    }

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: TODO.TODO_UPDATE_SUCCESS,
      data: todo,
    });
  } catch (error) {
    // console.error("Error updating todo:", error);
    return sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: TODO.TODO_UPDATE_FAIL,
      data: null,
    });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return sendResponse(res, {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: TODO.TODO_NOT_FOUND,
        data: [],
      });
    }

    return sendResponse(res, {
      statusCode: StatusCodes.NO_CONTENT,
      success: true,
      message: TODO.TODO_DELETE_SUCCESS,
      data: [],
    });
  } catch (error) {
    // console.error("Error deleting todo:", error);
    return sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: TODO.TODO_DELETE_FAIL,
      data: null,
    });
  }
};

export { addTodo, getTodos, updateTodo, deleteTodo };
