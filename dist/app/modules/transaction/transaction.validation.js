"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const addMoney = zod_1.default.object({
    amount: zod_1.default.number().min(10, "Minimum amount is 10"),
});
const sendMoney = zod_1.default.object({
    recieverWallet: zod_1.default
        .string()
        .min(13, "Wallet number must be at least 13 characters")
        .max(16, "Wallet number must not exceed 16 characters")
        .regex(/^WAL\d{10}$/, "Wallet number must start with 'WAL' followed by 10 digits"),
    amount: zod_1.default.number().min(10, "Minimum amount is 10"),
    note: zod_1.default.string().optional(),
});
const withdrawMoney = zod_1.default.object({
    amount: zod_1.default.number().min(10, "Minimum amount is 10"),
    note: zod_1.default.string().optional(),
});
const agentCashIn = zod_1.default.object({
    walletNumber: zod_1.default.string().min(1, "Target user ID is required"),
    amount: zod_1.default.number().min(10, "Minimum amount is 10"),
    note: zod_1.default.string().optional(),
});
const agentCashOut = zod_1.default.object({
    walletNumber: zod_1.default.string().min(1, "Target user ID is required"),
    amount: zod_1.default.number().min(10, "Minimum amount is 10"),
    note: zod_1.default.string().optional(),
});
exports.transactionValidation = {
    addMoney,
    sendMoney,
    withdrawMoney,
    agentCashIn,
    agentCashOut,
};
