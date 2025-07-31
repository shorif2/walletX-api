import { Types } from "mongoose";
export enum TransactionType {
  ADD = "add",
  WITHDRAW = "withdraw",
  SEND = "send",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  REVERSED = "reversed",
}

export interface ITransaction {
  _id?: Types.ObjectId;
  walletId: Types.ObjectId;
  type: TransactionType;
  initiatedBy: Types.ObjectId;
  toWalletId?: Types.ObjectId;
  amount: number;
  status?: TransactionStatus;
}
