import mongoose, { Schema } from "mongoose";
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "./transaction.types";

const TransactionSchema = new Schema<ITransaction>(
  {
    senderWallet: {
      type: String,
      required: function (this: ITransaction) {
        return this.type === TransactionType.SEND;
      },
    },
    walletNumber: {
      type: String,
      required: function (this: ITransaction) {
        return (
          this.type === TransactionType.CASH_IN ||
          this.type === TransactionType.CASH_OUT
        );
      },
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    initiatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recieverWallet: {
      type: String,
      required: function (this: ITransaction) {
        return this.type === TransactionType.SEND;
      },
    },
    note: {
      type: String,
      required: function (this: ITransaction) {
        return (
          this.type === TransactionType.WITHDRAW ||
          this.type === TransactionType.CASH_OUT ||
          this.type === TransactionType.SEND
        );
      },
    },
    amount: {
      type: Number,
      required: true,
      min: 10,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
