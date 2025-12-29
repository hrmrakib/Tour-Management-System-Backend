import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import HSC from "http-status-codes";
import { authServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await authServices.credentialsLogin(req.body);

    res.cookie("refreshToken", loginInfo.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });

    res.cookie("accessToken", loginInfo.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });

    sendResponse(res, {
      success: true,
      statusCode: HSC.OK,
      message: "User logged in successfully",
      data: loginInfo,
    });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new Error("Refresh expired. Please login first!");
    }

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
