import Todo from "../../models/Todo.model";
import { sendResponse } from "../../utils/response";
import { createTodoSchema } from "../../models/validators/Todo.zod";
import { StatusCodes } from "../../utils/constants/statusCodes/statusCode";
import { COMMON, TODO } from "../../utils/constants/messages/index";
import { ICustomerRequestUser } from "../../utils/interfaces";
import { NextFunction, Response } from "express";

export const deleteTodo = async (
  req: ICustomerRequestUser,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
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
