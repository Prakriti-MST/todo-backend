import { Request, Response } from "express";
import {User} from "../../models/User.model";
import generateToken from "../../utils/generateToken";
import { sendResponse } from "../../utils/response";
import { loginSchema } from "../../models/validators/User.zod";
import { StatusCodes } from "../../utils/constants/statusCodes/statusCode";
import { AUTH, COMMON } from "../../utils/constants/messages/index";

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: COMMON.VALIDATION_FAILED,
        data: parsed.error.flatten(),
      });
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: AUTH.LOGIN_USER_NOT_FOUND,
        data: null,
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendResponse(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: AUTH.LOGIN_INVALID_CREDS,
        data: null,
      });
    }

    const userID : string = user._id.toString();
    const token = generateToken(userID);
    // console.log("Login successful, user:", user);

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: AUTH.SIGNUP_SUCCESS,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    // console.error("Login error:", error);
    return sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: COMMON.INTERNAL_SERVER_ERROR,
      data: [],
    });
  }
};
