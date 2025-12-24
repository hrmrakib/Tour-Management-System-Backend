import { Request, Response } from "express";
import { User } from "./user.model";
import HSC from "http-status-codes";
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserServices.createUser(req.body)

    return res.status(HSC.CREATED).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(HSC.BAD_REQUEST).json({ success: false, error });
  }
};

export const userController = {
  createUser,
};
