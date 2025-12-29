import HSC from "http-status-codes";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateToken, verifyToken } from "../../utils/jwt";
import appConfig from "../../config/env";
import createUserToken from "../../utils/userToken";

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

  const { accessToken, refreshToken } = await createUserToken(isUserExist);

  const { password: userPasswod, ...rest } = isUserExist.toObject();

  return {
    accessToken,
    refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const verifiedToken = verifyToken(
    refreshToken,
    appConfig.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedToken.email });

  if (!isUserExist) {
    throw new AppError(HSC.NOT_FOUND, "User not found");
  }

  if (isUserExist.isDeleted) {
    throw new AppError(HSC.FORBIDDEN, "User account has been deleted.");
  } else if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      HSC.FORBIDDEN,
      `User account is ${IsActive.INACTIVE.toLowerCase()}. Please contact support.`
    );
  }

  const jwtPayload = {
    email: verifiedToken.email,
    id: verifiedToken._id,
    role: verifiedToken.role,
  };

  const accessToken = await generateToken(
    jwtPayload,
    appConfig.JWT_ACCESS_SECRET,
    appConfig.JWT_ACCESS_EXPIRE_IN as string | number
  );

  return { accessToken };
};

export const authServices = {
  credentialsLogin,
  getNewAccessToken,
};
