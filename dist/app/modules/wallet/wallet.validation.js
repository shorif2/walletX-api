"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const updateBalance = zod_1.default.object({
    amount: zod_1.default.number().min(0, "Amount must be a positive number"),
});
const walletNumberSchema = zod_1.default.object({
    walletNumber: zod_1.default
        .string()
        .min(13, "Wallet number must be at least 13 characters")
        .max(16, "Wallet number must not exceed 16 characters")
        .regex(/^WAL\d{10}$/, "Wallet number must start with 'WAL' followed by 10 digits"),
});
exports.walletValidation = {
    updateBalance,
    walletNumber: walletNumberSchema,
};
