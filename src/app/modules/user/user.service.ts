import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import HSC from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import appConfig from "../../config/env";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(HSC.CONFLICT, "User already exist");
  }
  const hashPassword = await bcrypt.hash(password as string, 10);

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  /**
   * email can't be updated
   * name, phone, password, address
   * password - should be encrypted with bcrypt
   * only admin superadmin - role, isDeleted
   * promoting superadmin - superadmin
   */

  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(HSC.NOT_FOUND, "User not found");
  }

  if (
    decodedToken.role !== Role.SUPER_ADMIN ||
    decodedToken.role !== Role.ADMIN
  ) {
    if (
      isUserExist.isDeleted ||
      isUserExist.isActive === IsActive.BLOCKED ||
      !isUserExist.isVarified
    ) {
      let message = "";

      if (isUserExist.isDeleted) {
        message = "User account has been deleted.";
      } else if (isUserExist.isActive === IsActive.BLOCKED) {
        message = "User account is blocked. Please contact support.";
      } else if (!isUserExist.isVarified) {
        message = "User account is not verified. Please verify your account.";
      }

      throw new AppError(HSC.FORBIDDEN, message);
    }
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER && payload.role === Role.GUIDE) {
      throw new AppError(HSC.FORBIDDEN, "You are not authorized!");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role !== Role.ADMIN) {
      throw new AppError(HSC.FORBIDDEN, "You are not authorized!");
    }

    if (payload.isActive || payload.isDeleted || payload.isVarified) {
      if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
        throw new AppError(HSC.FORBIDDEN, "You are not authorized!");
      }
    }

    if (payload.password) {
      payload.password = await bcrypt.hash(
        payload.password as string,
        appConfig.BCRYPT_SALT_ROUNDS
      );
    }

    const updatedUser = await User.findByIdAndUpdate(userId, payload, {
      new: true,
    });

    return updatedUser;
  }
};

const getAllUsers = async () => {
  const users = await User.find();
  const total = await User.countDocuments();

  return {
    meta: { total },
    users,
  };
};

export const UserServices = {
  createUser,
  updateUser,
  getAllUsers,
};
