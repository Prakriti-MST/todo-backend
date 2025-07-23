import Todo from "../models/Todo.model.js";
import messages from "../utils/constants/messages.js";
import { sendResponse } from "../utils/response.js";
import { createTodoSchema } from "../models/validators/Todo.zod.js";

const addTodo = async (req, res) => {
  try {
    const todoData = {
      ...req.body,
      owner: req.user._id.toString(), // Inject owner from auth middleware
    };

    const parsed = createTodoSchema.safeParse(todoData);
    // console.log("Parsed Todo Data:", parsed);
    if (!parsed.success) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: messages.VALIDATION_FAILED,
        data: parsed.error.flatten(),
      });
    }

    const newTodo = await Todo.create(parsed.data);

    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: messages.TODO_ADD_SUCCESS,
      data: newTodo,
    });
  } catch (error) {
    console.error("Error adding todo:", error);
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: messages.INTERNAL_SERVER_ERROR,
      data: null,
    });
  }
};

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ owner: req.user._id });
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: messages.TODO_FETCH_SUCCESS,
      data: todos,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: messages.INTERNAL_SERVER_ERROR,
      data: null,
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
        statusCode: 400,
        success: false,
        message: messages.TODO_NO_UPDATE_FIELDS,
        data: null,
      });
    }

    const todo = await Todo.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!todo) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: messages.TODO_NOT_FOUND,
        data: null,
      });
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: messages.TODO_UPDATE_SUCCESS,
      data: todo,
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: messages.INTERNAL_SERVER_ERROR,
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
        statusCode: 404,
        success: false,
        message: messages.TODO_NOT_FOUND,
        data: null,
      });
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: messages.TODO_DELETE_SUCCESS,
      data: null,
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: messages.INTERNAL_SERVER_ERROR,
      data: null,
    });
  }
};

export { addTodo, getTodos, updateTodo, deleteTodo };
