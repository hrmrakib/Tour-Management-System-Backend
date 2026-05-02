import { NextFunction, Request, Response } from "express";
import appConfig from "../config/env";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const catchAsync =
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
      // if (appConfig.MODE_ENV === "development") { // TODO: It handles from Global error handler
      //   console.log(err);
      // }
      next(err);
    });
  };

export default catchAsync;
