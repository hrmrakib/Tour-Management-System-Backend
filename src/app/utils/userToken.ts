import appConfig from "../config/env";
import AppError from "../errorHelpers/AppError";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import HSC from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";

export const createUserToken = async (user: Partial<IUser>) => {
  const jwtPayload = {
    email: user.email,
    id: user._id,
    role: user.role,
  };

  const accessToken = await generateToken(
    jwtPayload,
    appConfig.JWT_ACCESS_SECRET,
    appConfig.JWT_ACCESS_EXPIRE_IN as string | number
  );

  const refreshToken = await generateToken(
    jwtPayload,
    appConfig.JWT_REFRESH_SECRET,
    appConfig.JWT_REFRESH_EXPIRE_IN as string | number
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  if (!refreshToken) {
    throw new AppError(HSC.UNAUTHORIZED, "Please login first!");
  }

  const verifiedRefreshToken = verifyToken(
    refreshToken,
    appConfig.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

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
    email: verifiedRefreshToken.email,
    id: verifiedRefreshToken._id,
    role: verifiedRefreshToken.role,
  };

  const accessToken = await generateToken(
    jwtPayload,
    appConfig.JWT_ACCESS_SECRET,
    appConfig.JWT_ACCESS_EXPIRE_IN as string | number
  );

  return  accessToken ;
};
