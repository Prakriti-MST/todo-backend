import messages from "../constants/messages.js";
import User from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";
import { sendResponse } from "../utils/response.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: messages.SIGNUP_MISSING_FIELDS,
        data: null,
      });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: messages.SIGNUP_EMAIL_TAKEN });
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
    const { email, password } = req.body;
    if (!email || !password) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: messages.LOGIN_MISSING_FIELDS,
        data: null,
      });
    }
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
