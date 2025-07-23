import messages from "../utils/constants/messages.js";
import User from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";
import { sendResponse } from "../utils/response.js";
import {
  createUserSchema,
  loginSchema,
} from "../models/validators/User.zod.js";

export const signup = async (req, res) => {
  try {
    const parsed = createUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Validation failed",
        data: parsed.error.flatten(),
      });
    }

    const { name, email, password } = parsed.data;

    const existing = await User.findOne({ email });
    if (existing) {
      return sendResponse(res, {
        statusCode: 409,
        success: false,
        message: messages.SIGNUP_EMAIL_TAKEN,
        data: null,
      });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: messages.INTERNAL_SERVER_ERROR,
      data: null,
    });
  }
};

export const login = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Validation failed",
        data: parsed.error.flatten(),
      });
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: messages.LOGIN_USER_NOT_FOUND,
        data: null,
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: messages.LOGIN_INVALID_CREDS,
        data: null,
      });
    }

    const token = generateToken(user._id);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: messages.INTERNAL_SERVER_ERROR,
      data: null,
    });
  }
};
