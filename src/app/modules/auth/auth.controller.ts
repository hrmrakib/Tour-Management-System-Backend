import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import HSC from "http-status-codes";
import { AuthServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import appConfig from "../../config/env";
import passport from "passport";
import AppError from "../../errorHelpers/AppError";
import { createUserToken } from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      success: true,
      statusCode: HSC.OK,
      message: "User logged in successfully",
      data: loginInfo,
    });
  },
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new Error("Refresh expired. Please login first!");
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: HSC.OK,
      message: "Get a new access token successful ly",
      data: tokenInfo,
    });
  },
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
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const decodedToken = req.user;

  await AuthServices.resetPassword(
    oldPassword,
    newPassword,
    decodedToken as JwtPayload,
  );

  sendResponse(res, {
    success: true,
    statusCode: HSC.OK,
    message: "Password updated successfully",
    data: null,
  });
});

// const googleLogin = catchAsync(async (req: Request, res: Response) => {
//   const newPassword = req.body.newPassword;
//   const oldPassword = req.body.oldPassword;
//   const decodedToken = req.user;

//   await AuthServices.resetPassword(oldPassword, newPassword, decodedToken!);

//   sendResponse(res, {
//     success: true,
//     statusCode: HSC.OK,
//     message: "Password updated successfully",
//     data: null,
//   });
// });

const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    console.log("user", user);

    if (!user) {
      throw new AppError(HSC.NOT_FOUND, "Google authentication failed");
    }

    const tokenInfo = await createUserToken(user);

    setAuthCookie(res, tokenInfo);

    res.redirect(`${appConfig.GOOGLE_CALLBACK_URL}/success`);
  },
);

export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  // googleLogin,
  googleCallbackController,
};
