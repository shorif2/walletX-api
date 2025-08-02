import { Wallet } from "./wallet.model";
import { IWallet } from "./wallet.types";
import { Types } from "mongoose";
import { generateWalletNumber } from "../../utils/walletNumberGenerator";

const createWallet = async (userId: Types.ObjectId): Promise<IWallet> => {
  // Generate a unique wallet number
  const walletNumber = await generateWalletNumber();

  const wallet = await Wallet.create({
    userId,
    walletNumber,
    balance: 50, // Default balance as per model
    isBlocked: false, // Default to not blocked
  });

  return wallet;
};

const getWalletByUserId = async (
  userId: Types.ObjectId
): Promise<IWallet | null> => {
  const wallet = await Wallet.findOne({ userId });
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
  const wallet = await Wallet.findOne({ walletNumber });
  return wallet;
};

const updateWalletBalance = async (
  userId: Types.ObjectId,
  amount: number
): Promise<IWallet | null> => {
  const wallet = await Wallet.findOneAndUpdate(
    { userId },
    { $inc: { balance: amount } },
    { new: true }
  );
  return wallet;
};

const blockWallet = async (userId: Types.ObjectId): Promise<IWallet | null> => {
  const wallet = await Wallet.findOneAndUpdate(
    { userId },
    { isBlocked: true },
    { new: true }
  );
  return wallet;
};

const unblockWallet = async (
  userId: Types.ObjectId
): Promise<IWallet | null> => {
  const wallet = await Wallet.findOneAndUpdate(
    { userId },
    { isBlocked: false },
    { new: true }
  );
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
