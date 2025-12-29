import appConfig from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

const createUserToken = async (user: Partial<IUser>) => {
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
    refreshToken
  }
};

export default createUserToken;
