/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "./user.types";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      data: user,
    });
  }
);

// get all users
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All Users Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
// get single user by id
const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Validate if the ID is a valid ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID format");
    }

    const user = await UserServices.getUserById(new Types.ObjectId(id));

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Retrieved Successfully",
      data: user,
    });
  }
);

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  // Validate if the userId is a valid ObjectId
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID format");
  }

  const user = await UserServices.getUserById(new Types.ObjectId(userId));

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile fetched successfully",
    data: user,
  });
});

const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const allowedFields = ["name", "email", "password"];
  const updateData: Partial<IUser> = {};

  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      (updateData as any)[key] = req.body[key];
    }
  }

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID format");
  }

  const updatedUser = await UserServices.updateUserProfile(
    new Types.ObjectId(userId),
    updateData
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID");
  }

  const updatedUser = await UserServices.setUserBlockStatus(
    new Types.ObjectId(id),
    true
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User has been blocked",
    data: updatedUser,
  });
});

const unblockUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID");
  }

  const updatedUser = await UserServices.setUserBlockStatus(
    new Types.ObjectId(id),
    false
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User has been unblocked",
    data: updatedUser,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  getUserById,
  getMyProfile,
  updateUserProfile,
  unblockUser,
  blockUser,
};
