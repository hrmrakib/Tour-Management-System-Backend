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
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const tokenInfo = await authServices.getNewAccessToken(refreshToken);

    sendResponse(res, {
      success: true,
      statusCode: HSC.OK,
      message: "Get a new access token successfully",
      data: tokenInfo,
    });
  }
);

export const authController = {
  credentialsLogin,
  getNewAccessToken,
};
