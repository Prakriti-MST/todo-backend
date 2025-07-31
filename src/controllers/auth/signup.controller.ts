import { Request, Response } from "express";
import {User} from "../../models/User.model";
import generateToken from "../../utils/generateToken";
import { sendResponse } from "../../utils/response";
import { createUserSchema } from "../../models/validators/User.zod";
import { StatusCodes } from "../../utils/constants/statusCodes/statusCode";
import { AUTH, COMMON } from "../../utils/constants/messages/index";

export const signup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const parsed = createUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: COMMON.VALIDATION_FAILED,
        data: parsed.error.flatten(),
      });
    }

    const { name, email, password } = parsed.data;

    const existing = await User.findOne({ email });
    if (existing) {
      return sendResponse(res, {
        statusCode: StatusCodes.UNPROCESSABLE_CONTENT,
        success: false,
        message: AUTH.SIGNUP_EMAIL_TAKEN,
        data: [],
      });
    }

    const user = await User.create({ name, email, password });
    const userID: string = user._id.toString();
    const token = generateToken(userID);

    return sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: AUTH.SIGNUP_SUCCESS,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    // console.error("Signup error:", error);
    return sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: AUTH.SIGNUP_FAIL,
      data: [],
    });
  }
};
