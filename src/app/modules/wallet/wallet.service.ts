import { Wallet } from "./wallet.model";
import { IWallet } from "./wallet.types";
import { Types } from "mongoose";
import { generateWalletNumber } from "../../utils/walletNumberGenerator";

const createWallet = async (userId: Types.ObjectId): Promise<IWallet> => {
  // Generate a unique wallet number
  const walletNumber = await generateWalletNumber();

  const wallet = await Wallet.create({
    user: userId,
    walletNumber,
    balance: 50,
    isBlocked: false,
  });

  return wallet;
};

const getWalletByUserId = async (
  userId: Types.ObjectId
): Promise<IWallet | null> => {
  const wallet = await Wallet.findOne({ user: userId })
    .populate({
      path: "user",
      select: ["name", "email", "role", "isBlocked"],
    })
    .select(["-createdAt"]);
  return wallet;
};

const getWalletById = async (
  walletId: Types.ObjectId
): Promise<IWallet | null> => {
  const wallet = await Wallet.findById(walletId);
  return wallet;
};

const getWalletByWalletNumber = async (
  walletNumber: string
): Promise<IWallet | null> => {
  const wallet = await Wallet.findOne({ walletNumber })
    .select(["-updatedAt", "-password"])
    .populate({
      path: "user",
      select: ["-wallet", "-updatedAt", "-createdAt", "-password"],
    });
  return wallet;
};

const updateWalletBalance = async (
  identifier: string | Types.ObjectId,
  amount: number
): Promise<IWallet | null> => {
  let query: { walletNumber?: string; user?: Types.ObjectId };

  // Check if identifier is a wallet number (string) or userId (ObjectId)
  if (typeof identifier === "string" && identifier.length >= 10) {
    // It's a wallet number
    query = { walletNumber: identifier };
  } else {
    // It's a userId
    query = { user: identifier as Types.ObjectId };
  }

  const wallet = await Wallet.findOneAndUpdate(
    query,
    { $inc: { balance: amount } },
    { new: true }
  );
  return wallet;
};

const blockWallet = async (userId: Types.ObjectId): Promise<IWallet | null> => {
  const wallet = await Wallet.findOneAndUpdate(
    { user: userId },
    { isBlocked: true },
    { new: true }
  )
    .populate({
      path: "user",
      select: ["name", "email", "role", "isBlocked"],
    })
    .select(["-updatedAt"]);
  return wallet;
};

const unblockWallet = async (
  userId: Types.ObjectId
): Promise<IWallet | null> => {
  const wallet = await Wallet.findOneAndUpdate(
    { user: userId },
    { isBlocked: false },
    { new: true }
  )
    .populate({
      path: "user",
      select: ["name", "email", "role", "isBlocked"],
    })
    .select(["-updatedAt"]);
  return wallet;
};

export const WalletServices = {
  createWallet,
  getWalletByUserId,
  getWalletById,
  getWalletByWalletNumber,
  updateWalletBalance,
  blockWallet,
  unblockWallet,
};
