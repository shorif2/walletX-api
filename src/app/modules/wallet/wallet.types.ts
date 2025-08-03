import { Types } from "mongoose";

export interface IWallet {
  _id?: Types.ObjectId;
  user?: Types.ObjectId;
  walletNumber?: string;
  balance?: number;
  accountType?: string;
  isBlocked?: boolean;
}
