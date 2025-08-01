/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { TransactionServices } from "./transaction.service";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { WalletServices } from "../wallet/wallet.service";

// id issue here

// Add money to wallet
const addMoney = catchAsync(async (req: Request, res: Response) => {
  const { amount } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  // Get user's wallet
  const wallet = await WalletServices.getWalletByUserId(userId as any);
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  const transaction = await TransactionServices.addMoney(
    wallet._id as any,
    userId as any,
    amount
  );

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Money added successfully",
    data: transaction,
  });
});

// Send money to another user
const sendMoney = catchAsync(async (req: Request, res: Response) => {
  const { toUserId, amount } = req.body;
  const fromUserId = req.user?._id;

  if (!fromUserId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  // Get sender's wallet
  const fromWallet = await WalletServices.getWalletByUserId(fromUserId as any);
  if (!fromWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found");
  }

  const transaction = await TransactionServices.sendMoney(
    fromWallet._id as any,
    fromUserId as any,
    toUserId as any,
    amount
  );

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Money sent successfully",
    data: transaction,
  });
});

// Withdraw money from wallet
const withdrawMoney = catchAsync(async (req: Request, res: Response) => {
  const { amount } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  // Get user's wallet
  const wallet = await WalletServices.getWalletByUserId(userId as any);
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  const transaction = await TransactionServices.withdrawMoney(
    wallet._id as any,
    userId as any,
    amount
  );

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Money withdrawn successfully",
    data: transaction,
  });
});

// Get transaction history for current user
const getMyTransactionHistory = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }

    // Get user's wallet
    const wallet = await WalletServices.getWalletByUserId(userId as any);
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    const result = await TransactionServices.getTransactionHistory(
      wallet._id as any,
      page,
      limit
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Transaction history retrieved successfully",
      data: result.transactions,
      meta: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        limit,
      },
    });
  }
);

// Get specific transaction by ID
const getTransactionById = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const transaction = await TransactionServices.getTransactionById(
    transactionId as any
  );

  if (!transaction) {
    throw new AppError(httpStatus.NOT_FOUND, "Transaction not found");
  }

  // Check if user owns this transaction or is admin
  if (
    transaction.initiatedBy.toString() !== userId.toString() &&
    req.user?.role !== "ADMIN" &&
    req.user?.role !== "SUPER_ADMIN"
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "Access denied");
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Transaction retrieved successfully",
    data: transaction,
  });
});

// Get all transactions (admin only)
const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as string;
  const type = req.query.type as string;

  const result = await TransactionServices.getAllTransactions(
    page,
    limit,
    status as any,
    type as any
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "All transactions retrieved successfully",
    data: result.transactions,
    meta: {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      limit,
    },
  });
});

export const TransactionController = {
  addMoney,
  sendMoney,
  withdrawMoney,
  getMyTransactionHistory,
  getTransactionById,
  getAllTransactions,
};
