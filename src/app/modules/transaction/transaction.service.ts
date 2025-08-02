import { Transaction } from "./transaction.model";
import {
  ITransaction,
  TransactionType,
  TransactionStatus,
} from "./transaction.types";
import { WalletServices } from "../wallet/wallet.service";
import { UserServices } from "../user/user.service";
import { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

// Add money to wallet
const addMoney = async (
  senderWallet: string,
  userId: Types.ObjectId,
  amount: number
): Promise<ITransaction> => {
  // Validate amount
  if (amount < 10) {
    throw new AppError(httpStatus.BAD_REQUEST, "Minimum amount is 10");
  }

  // Check if wallet exists and is not blocked
  const wallet = await WalletServices.getWalletByUserId(userId);
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }
  if (wallet.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet is blocked");
  }

  // Create transaction
  const transaction = await Transaction.create({
    senderWallet,
    type: TransactionType.ADD,
    initiatedBy: userId,
    amount,
    status: TransactionStatus.PENDING,
  });

  // Update wallet balance
  await WalletServices.updateWalletBalance(userId, amount);

  // Update transaction status to completed
  await Transaction.findByIdAndUpdate(
    transaction._id,
    { status: TransactionStatus.COMPLETED },
    { new: true }
  );

  return transaction;
};

// Send money to another wallet
const sendMoney = async (
  fromWalletId: Types.ObjectId,
  fromUserId: Types.ObjectId,
  recieverWallet: string,
  amount: number,
  note?: string
): Promise<ITransaction> => {
  // Validate amount
  if (amount < 10) {
    throw new AppError(httpStatus.BAD_REQUEST, "Minimum amount is 10");
  }

  // Check if sender wallet exists and is not blocked
  const fromWallet = await WalletServices.getWalletByUserId(fromUserId);
  if (!fromWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found");
  }
  if (fromWallet.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "Sender wallet is blocked");
  }

  // Check if sender has sufficient balance
  if ((fromWallet.balance || 0) < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }

  // Check if receiver wallet exists and is not blocked
  const toWallet = await WalletServices.getWalletByWalletNumber(recieverWallet);
  if (!toWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");
  }
  if (toWallet.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "Receiver wallet is blocked");
  }

  // Check if sender and receiver are different
  if (fromWallet._id?.toString() === toWallet._id?.toString()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot send money to yourself");
  }

  // Ensure wallet IDs exist
  if (!toWallet._id || !toWallet.userId) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Invalid wallet data");
  }

  // Create transaction
  const transaction = await Transaction.create({
    senderWallet: fromWallet.walletNumber,
    type: TransactionType.SEND,
    initiatedBy: fromUserId,
    recieverWallet: recieverWallet,
    amount,
    status: TransactionStatus.COMPLETED,
    note,
  });

  // Update both wallet balances
  await WalletServices.updateWalletBalance(fromUserId, -amount);
  await WalletServices.updateWalletBalance(toWallet.userId, amount);

  return transaction;
};

// Withdraw money from wallet
const withdrawMoney = async (
  // walletId: Types.ObjectId,
  userId: Types.ObjectId,
  amount: number,
  note?: string
): Promise<ITransaction> => {
  // Validate amount
  if (amount < 10) {
    throw new AppError(httpStatus.BAD_REQUEST, "Minimum amount is 10");
  }

  // Check if wallet exists and is not blocked
  const wallet = await WalletServices.getWalletByUserId(userId);
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }
  if (wallet.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet is blocked");
  }

  // Check if user has sufficient balance
  if ((wallet.balance || 0) < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }

  // Create transaction
  const transaction = await Transaction.create({
    walletNumber: wallet.walletNumber,
    type: TransactionType.WITHDRAW,
    initiatedBy: userId,
    amount,
    status: TransactionStatus.COMPLETED,
    note,
  });

  // Update wallet balance
  await WalletServices.updateWalletBalance(userId, -amount);

  return transaction;
};

// Agent cash-in: Add money to any user's wallet
const agentCashIn = async (
  agentId: Types.ObjectId,
  walletNumber: string,
  amount: number,
  note?: string
): Promise<ITransaction> => {
  // Validate amount
  if (amount < 10) {
    throw new AppError(httpStatus.BAD_REQUEST, "Minimum amount is 10");
  }

  // Verify agent exists and has AGENT role
  const agent = await UserServices.getUserById(agentId);
  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }
  if (agent.role !== "AGENT") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only agents can perform this operation"
    );
  }

  // Check if target user's wallet exists and is not blocked
  const wallet = await WalletServices.getWalletByWalletNumber(walletNumber);
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Target user's wallet not found");
  }
  if (wallet.isBlocked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Target user's wallet is blocked"
    );
  }

  // Create transaction
  const transaction = await Transaction.create({
    walletNumber: wallet.walletNumber,
    type: TransactionType.CASH_IN,
    initiatedBy: agentId,
    amount,
    status: TransactionStatus.COMPLETED,
    note: note ? `Agent cash-in: ${note}` : "Agent cash-in",
  });

  // Update wallet balance
  await WalletServices.updateWalletBalance(wallet.userId as any, amount);

  return transaction;
};

// Agent cash-out: Withdraw money from any user's wallet
const agentCashOut = async (
  agentId: Types.ObjectId,
  walletNumber: string,
  amount: number,
  note?: string
): Promise<ITransaction> => {
  // Validate amount
  if (amount < 10) {
    throw new AppError(httpStatus.BAD_REQUEST, "Minimum amount is 10");
  }

  // Verify agent exists and has AGENT role
  const agent = await UserServices.getUserById(agentId);
  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }
  if (agent.role !== "AGENT") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only agents can perform this operation"
    );
  }

  // Check if target user's wallet exists and is not blocked
  const wallet = await WalletServices.getWalletByWalletNumber(walletNumber);
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Target user's wallet not found");
  }
  if (wallet.isBlocked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Target user's wallet is blocked"
    );
  }

  // Check if user has sufficient balance
  if ((wallet.balance || 0) < amount) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Insufficient balance in target user's wallet"
    );
  }

  // Create transaction
  const transaction = await Transaction.create({
    walletNumber: wallet.walletNumber,
    type: TransactionType.CASH_OUT,
    initiatedBy: agentId,
    amount,
    status: TransactionStatus.COMPLETED,
    note: note ? `Agent cash-out: ${note}` : "Agent cash-out",
  });

  // Update wallet balance
  await WalletServices.updateWalletBalance(wallet.userId as any, -amount);

  return transaction;
};

// Get transaction history for a wallet
const getTransactionHistory = async (
  walletId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{
  transactions: ITransaction[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const skip = (page - 1) * limit;

  const transactions = await Transaction.find({ walletId })
    .populate("initiatedBy", "name email")
    .populate("toWalletId", "userId")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments({ walletId });
  const totalPages = Math.ceil(total / limit);

  return {
    transactions,
    total,
    page,
    totalPages,
  };
};

// Get transaction by ID
const getTransactionById = async (
  transactionId: Types.ObjectId
): Promise<ITransaction | null> => {
  const transaction = await Transaction.findById(transactionId)
    .populate("initiatedBy", "name email")
    .populate("toWalletId", "userId");

  return transaction;
};

// Get all transactions (for admin)
const getAllTransactions = async (
  page = 1,
  limit = 10,
  status?: TransactionStatus,
  type?: TransactionType
): Promise<{
  transactions: ITransaction[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (type) filter.type = type;

  const transactions = await Transaction.find(filter)
    .populate("initiatedBy", "name email")
    .populate("toWalletId", "userId")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  return {
    transactions,
    total,
    page,
    totalPages,
  };
};

export const TransactionServices = {
  addMoney,
  sendMoney,
  withdrawMoney,
  agentCashIn,
  agentCashOut,
  getTransactionHistory,
  getTransactionById,
  getAllTransactions,
};
