import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";
import { isApproved, IUser } from "../modules/user/user.types";
import { verifyToken } from "../utils/jwt";
import { Agent } from "../modules/agent/agent.model";
import { AgentStatus } from "../modules/agent/agent.types";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No Token Recieved");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({
        email: verifiedToken.email,
      }).select(["-createdAt", "-updatedAt"]);

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }
      if (
        isUserExist.isApproved === isApproved.BLOCKED ||
        isUserExist.isApproved === isApproved.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.isApproved}`
        );
      }
      if (isUserExist.isBlocked) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is Blocked");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route!!!");
      }
      req.user = isUserExist as IUser;
      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
export const checkAuthAndAgent =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No Token Recieved");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await Agent.findOne({
        email: verifiedToken.email,
      }).select(["-createdAt", "-updatedAt"]);

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }
      if (isUserExist.status === AgentStatus.SUSPENDED) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Agent is ${isUserExist.status}`
        );
      }
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route!!!");
      }
      req.user = isUserExist as IUser;
      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
