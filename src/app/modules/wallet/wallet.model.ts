import { Schema, model } from "mongoose";
import { IWallet } from "./wallet.types";

const walletSchema = new Schema<IWallet>(
  {
    walletNumber: {
      type: String,
      required: true,
      unique: true,
      minlength: 10,
      maxlength: 16,
    },
    balance: {
      type: Number,
      default: 50,
      min: 0,
    },
    accountType: {
      type: String,
      default: "Savings",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
