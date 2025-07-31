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
    toUserId: zod_1.default.string().min(1, "Receiver user ID is required"),
    amount: zod_1.default.number().min(10, "Minimum amount is 10"),
});
const withdrawMoney = zod_1.default.object({
    amount: zod_1.default.number().min(10, "Minimum amount is 10"),
});
exports.transactionValidation = {
    addMoney,
    sendMoney,
    withdrawMoney,
};
