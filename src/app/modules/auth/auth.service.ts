import HSC from "http-status-codes";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/jwt";
import appConfig from "../../config/env";

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
  };

  const accessToken = await generateToken(
    jwtPayload,
    appConfig.JWT_ACCESS_SECRET,
    appConfig.JWT_ACCESS_EXPIRE_IN as string | number
  );

  return {
    email: isUserExist.email,
    accessToken,
  };
};

export const authServices = {
  credentialsLogin,
};
