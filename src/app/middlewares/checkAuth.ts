import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import HSC from "http-status-codes";
import appConfig from "../config/env";
import { JwtPayload } from "jsonwebtoken";

const checkAuth =
  (...roles: string[]) =>
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

      if (!verifiedToken) {
        throw new AppError(HSC.UNAUTHORIZED, "You are not authorized!");
      }

      if (!roles.includes(verifiedToken.role)) {
        throw new AppError(HSC.UNAUTHORIZED, "You have no permission!");
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default checkAuth;
