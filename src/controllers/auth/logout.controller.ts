import { Request, Response } from "express";
import { sendResponse } from "../../utils/response";
import { StatusCodes } from "../../utils/constants/statusCodes/statusCode";
import { AUTH, COMMON } from "../../utils/constants/messages/index";

export const logout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // You might also clear a cookie or token here:
    // res.clearCookie("token");

    return sendResponse(res, {
      statusCode: StatusCodes.NO_CONTENT,
      success: true,
      message: AUTH.LOGOUT_SUCCESS,
      data: [],
    });
  } catch (error) {
    console.error("Logout error:", error);
    return sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: COMMON.INTERNAL_SERVER_ERROR,
      data: [],
    });
  }
};
