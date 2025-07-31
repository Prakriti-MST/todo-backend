import jwt from "jsonwebtoken";
import { User } from "../models/User.model";
import { sendResponse } from "../utils/response";
import { StatusCodes } from "../utils/constants/statusCodes/statusCode";
import { AUTH } from "../utils/constants/messages/index";
import { ICustomerRequestUser } from "../utils/interfaces";
import { NextFunction, Response } from "express";

interface JwtPayloadWithId {
  id: string;
  iat: number;
  exp: number;
}

export const authMiddleware = async (
  req: ICustomerRequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const JWT_SECRET = process.env.SECRET;
    if (!JWT_SECRET) {
      console.error("Missing SECRET");
      process.exit(1);
    }

    let token: string | undefined;

    const authHeader = req.headers["authorization"];
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (typeof req.body?.token === "string") {
      token = req.body.token;
    }

    if (!token) {
      return sendResponse(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: AUTH.AUTH_NO_TOKEN,
        data: [],
      });
    }

    let decoded: JwtPayloadWithId;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithId;
    } catch {
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

    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    return sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: AUTH.AUTH_ERROR,
      data: null,
    });
  }
};
