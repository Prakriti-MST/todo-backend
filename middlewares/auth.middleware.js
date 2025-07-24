import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
// import messages from "../utils/constants/messages.js";
import { sendResponse } from "../utils/response.js";
import { StatusCodes } from "../utils/constants/statusCodes/statusCode.js";
import { AUTH } from "../utils/constants/messages/index.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // 1) Try Bearer header
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    // 2) Fallback to cookie
    if (!token && req.cookies) {
      token = req.cookies.token;
    }
    // 3) Fallback to body
    if (!token && req.body?.token) {
      token = req.body.token;
    }

    if (!token) {
      // return res.status(401).json({ message: messages.AUTH_NO_TOKEN });
      return sendResponse(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: AUTH.AUTH_NO_TOKEN,
        data: [],
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET);
    } catch (err) {
      // console.error("JWT verification failed:", err);
      
      return sendResponse(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: AUTH.AUTH_INVALID_TOKEN,
        data: [],
      });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return sendResponse(res, {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: AUTH.LOGIN_USER_NOT_FOUND,
        data: [],
      });
    }

    req.user = user;
    next();
  } catch (err) {
    // console.error("Error in auth middleware:", err);

    return sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: AUTH.AUTH_ERROR,
      data: null,
    });
  }
};
