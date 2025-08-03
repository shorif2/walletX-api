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
const walletNumberGenerator_1 = require("../../utils/walletNumberGenerator");
const createWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Generate a unique wallet number
    const walletNumber = yield (0, walletNumberGenerator_1.generateWalletNumber)();
    const wallet = yield wallet_model_1.Wallet.create({
        user: userId,
        walletNumber,
        balance: 50,
        isBlocked: false,
    });
    return wallet;
});
const getWalletByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId })
        .populate({
        path: "user",
        select: ["name", "email", "role", "isBlocked"],
    })
        .select(["-createdAt"]);
    return wallet;
});
const getWalletById = (walletId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findById(walletId);
    return wallet;
});
const getWalletByWalletNumber = (walletNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ walletNumber })
        .select(["-updatedAt", "-password"])
        .populate({
        path: "user",
        select: ["-wallet", "-updatedAt", "-createdAt", "-password"],
    });
    return wallet;
});
const updateWalletBalance = (identifier, amount) => __awaiter(void 0, void 0, void 0, function* () {
    let query;
    // Check if identifier is a wallet number (string) or userId (ObjectId)
    if (typeof identifier === "string" && identifier.length >= 10) {
        // It's a wallet number
        query = { walletNumber: identifier };
    }
    else {
        // It's a userId
        query = { user: identifier };
    }
    const wallet = yield wallet_model_1.Wallet.findOneAndUpdate(query, { $inc: { balance: amount } }, { new: true });
    return wallet;
});
const blockWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOneAndUpdate({ user: userId }, { isBlocked: true }, { new: true })
        .populate({
        path: "user",
        select: ["name", "email", "role", "isBlocked"],
    })
        .select(["-updatedAt"]);
    return wallet;
});
const unblockWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOneAndUpdate({ user: userId }, { isBlocked: false }, { new: true })
        .populate({
        path: "user",
        select: ["name", "email", "role", "isBlocked"],
    })
        .select(["-updatedAt"]);
    return wallet;
});
exports.WalletServices = {
    createWallet,
    getWalletByUserId,
    getWalletById,
    getWalletByWalletNumber,
    updateWalletBalance,
    blockWallet,
    unblockWallet,
};
