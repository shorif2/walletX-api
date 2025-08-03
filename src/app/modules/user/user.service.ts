import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { User } from "./user.model";
import { IUser } from "./user.types";
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { WalletServices } from "../wallet/wallet.service";
import { Types } from "mongoose";
import { Agent } from "../agent/agent.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  const isAgentExist = await Agent.findOne({ email });

  if (isUserExist || isAgentExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const user = await User.create({
    email,
    password: hashedPassword,
    ...rest,
  });

  // Automatically create wallet for the new user
  let wallet;
  try {
    wallet = await WalletServices.createWallet(user._id);

    // Update user with wallet reference
    await User.findByIdAndUpdate(user._id, { wallet: wallet._id });

    // Update the user object to include wallet reference
    user.wallet = wallet._id;
  } catch (error) {
    // If wallet creation fails, we should handle it appropriately
    // For now, we'll log the error but not fail the user creation
    console.error("Failed to create wallet for user:", user._id, error);
  }

  return user;
};
//get all users
const getAllUsers = async () => {
  const users = await User.find({}).populate("wallet");
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

// Get user by ID
const getUserById = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId)
    .populate({
      path: "wallet",
      select: ["walletNumber", "balance", "isBlocked", "-_id"],
    })
    .select(["-updatedAt", "-password"]);
  return user;
};

const updateUserProfile = async (
  userId: Types.ObjectId,
  updateData: Partial<IUser>
) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  })
    .select("-password -updatedAt")
    .populate({
      path: "wallet",
      select: ["walletNumber", "balance", "isBlocked", "-_id"],
    });

  return user;
};

const setUserBlockStatus = async (userId: Types.ObjectId, block: boolean) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isBlocked: block },
    { new: true, runValidators: true }
  )
    .select("-password -updatedAt")
    .populate({
      path: "wallet",
      select: ["walletNumber", "balance", "isBlocked", "-_id"],
    });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

export const UserServices = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserProfile,
  setUserBlockStatus,
};
