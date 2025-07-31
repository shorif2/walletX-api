import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { User } from "./user.model";
import { IUser } from "./user.types";
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { WalletServices } from "../wallet/wallet.service";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
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
  try {
    await WalletServices.createWallet(user._id);
  } catch (error) {
    // If wallet creation fails, we should handle it appropriately
    // For now, we'll log the error but not fail the user creation
    console.error("Failed to create wallet for user:", user._id, error);
  }

  return user;
};
//get all users
const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
};
