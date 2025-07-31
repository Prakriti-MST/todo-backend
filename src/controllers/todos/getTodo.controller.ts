import Todo from "../../models/Todo.model";
import { sendResponse } from "../../utils/response";
import { createTodoSchema } from "../../models/validators/Todo.zod";
import { StatusCodes } from "../../utils/constants/statusCodes/statusCode";
import { COMMON, TODO } from "../../utils/constants/messages/index";
import { ICustomerRequestUser } from "../../utils/interfaces";
import { NextFunction, Response } from "express";

export const getTodos = async (
  req: ICustomerRequestUser,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const todos = await Todo.find({ owner: req.user?._id });
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
