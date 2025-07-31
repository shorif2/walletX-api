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
exports.walletValidation = {
    updateBalance,
};
