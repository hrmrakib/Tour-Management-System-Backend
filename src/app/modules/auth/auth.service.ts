import HSC from "http-status-codes";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import bcrypt from "bcryptjs";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userToken";

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
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return { accessToken: newAccessToken };
};

export const authServices = {
  credentialsLogin,
  getNewAccessToken,
};
