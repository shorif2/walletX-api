import { Types } from "mongoose";

export interface IWallet {
  _id?: Types.ObjectId;
  userId?: Types.ObjectId;
  walletNumber?: string;
  balance?: number;
  isBlocked?: boolean;
}
