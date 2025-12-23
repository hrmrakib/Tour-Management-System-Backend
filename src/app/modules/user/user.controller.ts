import { Request, Response } from "express";
import { User } from "./user.model";
import HSC from "http-status-codes";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email });

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
