"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletServices = void 0;
const wallet_model_1 = require("./wallet.model");
const createWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.create({
        userId,
        balance: 50, // Default balance as per model
        isBlocked: false, // Default to not blocked
    });
    return wallet;
});
const getWalletByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ userId });
    return wallet;
});
const getWalletById = (walletId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findById(walletId);
    return wallet;
});
const updateWalletBalance = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOneAndUpdate({ userId }, { $inc: { balance: amount } }, { new: true });
    return wallet;
});
const blockWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOneAndUpdate({ userId }, { isBlocked: true }, { new: true });
    return wallet;
});
const unblockWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOneAndUpdate({ userId }, { isBlocked: false }, { new: true });
    return wallet;
});
exports.WalletServices = {
    createWallet,
    getWalletByUserId,
    getWalletById,
    updateWalletBalance,
    blockWallet,
    unblockWallet,
};
