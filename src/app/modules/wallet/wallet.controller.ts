import { Request, Response } from "express";
import { WalletServices } from "./wallet.service";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const getWalletByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const wallet = await WalletServices.getWalletByUserId(userId as any);

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Wallet retrieved successfully",
    data: wallet,
  });
});

const updateWalletBalance = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { amount } = req.body;

  if (!amount || typeof amount !== "number") {
    throw new AppError(httpStatus.BAD_REQUEST, "Valid amount is required");
  }

  const wallet = await WalletServices.updateWalletBalance(
    userId as any,
    amount
  );

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Wallet balance updated successfully",
    data: wallet,
  });
});

const blockWallet = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const wallet = await WalletServices.blockWallet(userId as any);

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Wallet blocked successfully",
    data: wallet,
  });
});

const unblockWallet = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const wallet = await WalletServices.unblockWallet(userId as any);

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Wallet unblocked successfully",
    data: wallet,
  });
});

export const WalletController = {
  getWalletByUserId,
  updateWalletBalance,
  blockWallet,
  unblockWallet,
};
