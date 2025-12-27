import { NextFunction, Request, Response } from "express";
import HSC from "http-status-codes";
import { UserServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import appConfig from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      success: true,
      message: "User created successfully!",
      statusCode: HSC.CREATED,
      data: user
    })
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(token as string, appConfig.JWT_ACCESS_SECRET) as JwtPayload;
     
    const verifiedToken = req.user as JwtPayload;
    const payload = req.body;

    const user = await UserServices.updateUser(userId, payload, verifiedToken);

    sendResponse(res, {
      success: true,
      message: "User updated successfully!",
      statusCode: HSC.OK,
      data: user
    })
  }
);

const getAllUsers = async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsers();

  sendResponse(res, {
    success: true,
    statusCode: HSC.OK,
    message: "Users retrieved successfully",
    meta: {
      total: result.meta.total,
    },
    data: result.users,
  });
};

export const userController = {
  createUser,
  updateUser,
  getAllUsers,
};
