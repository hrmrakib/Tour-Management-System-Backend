import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import HSC from "http-status-codes";
import appConfig from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(HSC.UNAUTHORIZED, "You are not authorized!");
      }

      const verifiedToken = verifyToken(
        accessToken,
        appConfig.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({
        email: verifiedToken.email,
      });

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

      req.user = verifiedToken;

      if (!verifiedToken) {
        throw new AppError(HSC.UNAUTHORIZED, "You are not authorized!");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(HSC.UNAUTHORIZED, "You have no permission!");
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default checkAuth;
