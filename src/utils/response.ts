import { Response } from "express";

export function sendResponse<T>(
  res: Response,
  response: {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
  }
): Response {
  return res.status(200).json(response);
}
