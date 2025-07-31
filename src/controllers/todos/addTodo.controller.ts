import Todo from "../../models/Todo.model";
import { sendResponse } from "../../utils/response";
import { createTodoSchema } from "../../models/validators/Todo.zod";
import { StatusCodes } from "../../utils/constants/statusCodes/statusCode";
import { COMMON, TODO } from "../../utils/constants/messages/index";
import { ICustomerRequestUser } from "../../utils/interfaces";
import { NextFunction, Response } from "express";

export const addTodo = async (
  req: ICustomerRequestUser,
  res: Response,
  next : NextFunction
): Promise<Response | void> => {
  try {
    const todoData = {
      ...req.body,
      owner: req.user?._id?.toString(),
    };

    // console.log("Todo Data:", todoData);
    const parsed = createTodoSchema.safeParse(todoData);
    // console.log("Parsed Todo Data:", parsed);

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
