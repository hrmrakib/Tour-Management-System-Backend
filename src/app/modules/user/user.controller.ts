import { NextFunction, Request, Response } from "express";
import HSC from "http-status-codes";
import { UserServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    res.status(HSC.CREATED).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
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
  getAllUsers,
};
