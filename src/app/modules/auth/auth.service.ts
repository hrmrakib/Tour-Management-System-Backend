import HSC from "http-status-codes";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(HSC.NOT_FOUND, "User not found");
  }

  const isPasswordMatched = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(HSC.UNAUTHORIZED, "Invalid credentials");
  }

  const jwtPayload = {
    email: isUserExist.email,
    id: isUserExist._id,
    role: isUserExist.role,
    // isActive: isUserExist.isActive,
    // isVarified: isUserExist.isVarified,
    // isDeleted: isUserExist.isDeleted,
  };

  const accessToken = await jwt.sign(jwtPayload, "secret_key_here" as string, {
    expiresIn: "1d",
  });

  return {
    email: isUserExist.email,
    accessToken,
  };
};

export const authServices = {
  credentialsLogin,
};
