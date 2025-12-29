import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import HSC from "http-status-codes";
import { authServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await authServices.credentialsLogin(req.body);

    setAuthCookie(res, loginInfo);

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

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: HSC.OK,
      message: "Get a new access token successful ly",
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  sendResponse(res, {
    success: true,
    statusCode: HSC.OK,
    message: "User logged out successfully",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as any;

  const newPassword = req.body.newPassword;

  const result = await authServices.resetPassword(decodedToken, newPassword);
});

export const authController = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
};
