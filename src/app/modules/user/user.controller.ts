import { NextFunction, Request, Response } from "express";
import HSC from "http-status-codes";
import { UserServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";



const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
  const user = await UserServices.createUser(req.body);

  res.status(HSC.CREATED).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
})

// const createUser = async (req: Request, res: Response) => {
//   try {
//     const user = await UserServices.createUser(req.body);

//     return res.status(HSC.CREATED).json({
//       success: true,
//       message: "User created successfully",
//       data: user,
//     });
//   } catch (error) {
//     return res.status(HSC.BAD_REQUEST).json({ success: false, error });
//   }
// };

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserServices.getAllUsers();
    return res.status(HSC.OK).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    return res.status(HSC.BAD_REQUEST).json({ success: false, error });
  }
};

export const userController = {
  createUser,
  getAllUsers,
};
