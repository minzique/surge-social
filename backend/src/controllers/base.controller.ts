import { Response } from "express";
import { ApiResponse } from "../types/shared/api.types";

const sendResponse = <T>(
  res: Response,
  status: number,
  data?: T,
  message?: string,
  error?: string
): Response<ApiResponse<T>> => {
  return res.status(status).json({
    success: !error,
    data,
    message,
    error,
  });
};

export abstract class BaseController {
  protected success<T>(res: Response, data: T, message?: string, status = 200) {
    return sendResponse(res, status, data, message);
  }

  protected error(res: Response, error: string, status = 400) {
    return sendResponse(res, status, undefined, undefined, error);
  }
}
