import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import appConfig from "../../config/env";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "User already exist");
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

const updateUserV1 = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
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
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (
    decodedToken.role !== Role.SUPER_ADMIN ||
    decodedToken.role !== Role.ADMIN
  ) {
    if (
      isUserExist.isDeleted ||
      isUserExist.isActive === IsActive.BLOCKED ||
      !isUserExist.isVerified
    ) {
      let message = "";

      if (isUserExist.isDeleted) {
        message = "User account has been deleted.";
      } else if (isUserExist.isActive === IsActive.BLOCKED) {
        message = "User account is blocked. Please contact support.";
      } else if (!isUserExist.isVerified) {
        message = "User account is not verified. Please verify your account.";
      }

      throw new AppError(httpStatus.FORBIDDEN, message);
    }
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER && payload.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role !== Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
      if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
      }
    }

    if (payload.password) {
      payload.password = await bcrypt.hash(
        payload.password as string,
        appConfig.BCRYPT_SALT_ROUNDS,
      );
    }

    const updatedUser = await User.findByIdAndUpdate(userId, payload, {
      new: true,
    });

    return updatedUser;
  }
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {
  // 1. Check if the target user exists
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // 2. BLOCK regular users/guides from modifying another user's profile
  const isSelfUpdate = decodedToken.id === isUserExist._id.toString();
  const isAdminOrSuperAdmin =
    decodedToken.role === Role.SUPER_ADMIN || decodedToken.role === Role.ADMIN;

  if (!isSelfUpdate && !isAdminOrSuperAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You cannot update another user's profile!",
    );
  }

  // 3. Status checks for non-administrative roles (Self/User updates)
  if (!isAdminOrSuperAdmin) {
    if (isUserExist.isDeleted) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "User account has been deleted.",
      );
    }
    if (isUserExist.isActive === IsActive.BLOCKED) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "User account is blocked. Please contact support.",
      );
    }
    if (!isUserExist.isVerified) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "User account is not verified. Please verify your account.",
      );
    }
  }

  // 4. RULE: A regular user/guide CANNOT change their own or anyone else's role
  if (payload.role && !isAdminOrSuperAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update roles!",
    );
  }

  // 5. RULE: Only SUPER_ADMIN can make someone an ADMIN or SUPER_ADMIN
  if (
    payload.role &&
    (payload.role === Role.ADMIN || payload.role === Role.SUPER_ADMIN)
  ) {
    if (decodedToken.role !== Role.SUPER_ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only a Super Admin can grant Admin privileges!",
      );
    }
  }

  // 6. RULE: Only Admins/SuperAdmins can touch status updates (isActive, isDeleted, isVerified)
  if (
    payload.isActive !== undefined ||
    payload.isDeleted !== undefined ||
    payload.isVerified !== undefined
  ) {
    if (!isAdminOrSuperAdmin) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to change administrative statuses!",
      );
    }
  }

  // 7. Enforce email immutability safety guard
  if (payload.email) {
    delete payload.email;
  }

  // 8. Handle password hashing securely
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(appConfig.BCRYPT_SALT_ROUNDS),
    );
  }

  // 9. Execute update safely outside structural conditional barriers
  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select("-password"); // Safeguard: exclude password from return payload

  return updatedUser;
};

const getAllUsers = async () => {
  const users = await User.find().select("-password -auths");
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
