import { NextFunction, Request, Response } from "express";
import appConfig from "../config/env";
import AppError from "../errorHelpers/AppError";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Something has been wrong!";

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }

  res.status(500).json({
    success: false,
    message: `${error.message}` || "Something has been wrong!",
    error,
    stack: appConfig.ENV_MODE === "development" ? error.stack : null,
  });
};

export default globalErrorHandler;
