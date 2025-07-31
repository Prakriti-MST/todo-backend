import Todo from "../../models/Todo.model";
import { sendResponse } from "../../utils/response";
import { createTodoSchema } from "../../models/validators/Todo.zod";
import { StatusCodes } from "../../utils/constants/statusCodes/statusCode";
import { COMMON, TODO } from "../../utils/constants/messages/index";
import { ICustomerRequestUser } from "../../utils/interfaces";
import { NextFunction, Response } from "express";

export const updateTodo = async (
  req: ICustomerRequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    console.log("req.body", req.body);
    const updates: Record<string, any> = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.description !== undefined)
      updates.description = req.body.description;
    if (req.body.status !== undefined) updates.status = req.body.status;
    if (req.body.priority !== undefined) updates.priority = req.body.priority;

    if (Object.keys(updates).length === 0) {
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: TODO.TODO_NO_UPDATE_FIELDS,
        data: [],
      });
    }

    // Perform the update
    const todo = await Todo.findByIdAndUpdate(id, updates, { new: true });
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
    return sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: TODO.TODO_UPDATE_FAIL,
      data: null,
    });
  }
};
