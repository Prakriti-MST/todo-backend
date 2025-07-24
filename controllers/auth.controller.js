
import User from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";
import { sendResponse } from "../utils/response.js";
import {
  createUserSchema,
  loginSchema,
} from "../models/validators/User.zod.js";
import { StatusCodes } from "../utils/constants/statusCodes/statusCode.js";
import { AUTH, COMMON } from "../utils/constants/messages/index.js";

export const signup = async (req, res) => {
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
    const token = generateToken(user._id);

    

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

export const login = async (req, res) => {
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

    const token = generateToken(user._id);
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

export const logout = (req, res) => {
  return sendResponse(res, {
    statusCode: StatusCodes.NO_CONTENT,
    success: true,
    message: AUTH.LOGOUT_SUCCESS,
    data: null,
  });
};
export default { signup, login, logout };
