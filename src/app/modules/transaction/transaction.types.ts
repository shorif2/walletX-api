import { Types } from "mongoose";
export enum TransactionType {
  ADD = "add",
  WITHDRAW = "withdraw",
  SEND = "send",
  CASH_IN = "cash-in",
  CASH_OUT = "cash-out",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  REVERSED = "reversed",
}

export interface ITransaction {
  _id?: Types.ObjectId;
  senderWallet: string;
  walletNumber?: string;
  type: TransactionType;
  initiatedBy: Types.ObjectId;
  toWalletId?: Types.ObjectId;
  recieverWallet: string;
  amount: number;
  note?: string;
  status?: TransactionStatus;
}
