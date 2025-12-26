import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import HSC from "http-status-codes";
import { authServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await authServices.credentialsLogin(req.body);

    sendResponse(res, {
      success: true,
      statusCode: HSC.OK,
      message: "User logged in successfully",
      data: user,
    });
  }
);

export const authController = {
  credentialsLogin,
};
