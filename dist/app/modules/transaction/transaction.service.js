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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionServices = void 0;
const transaction_model_1 = require("./transaction.model");
const transaction_types_1 = require("./transaction.types");
const wallet_service_1 = require("../wallet/wallet.service");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// Add money to wallet
const addMoney = (walletId, userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate amount
    if (amount < 10) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Minimum amount is 10");
    }
    // Check if wallet exists and is not blocked
    const wallet = yield wallet_service_1.WalletServices.getWalletByUserId(userId);
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    if (wallet.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet is blocked");
    }
    // Create transaction
    const transaction = yield transaction_model_1.Transaction.create({
        walletId,
        type: transaction_types_1.TransactionType.ADD,
        initiatedBy: userId,
        amount,
        status: transaction_types_1.TransactionStatus.PENDING,
    });
    // Update wallet balance
    yield wallet_service_1.WalletServices.updateWalletBalance(userId, amount);
    // Update transaction status to completed
    yield transaction_model_1.Transaction.findByIdAndUpdate(transaction._id, { status: transaction_types_1.TransactionStatus.COMPLETED }, { new: true });
    return transaction;
});
// Send money to another wallet
const sendMoney = (fromWalletId, fromUserId, toUserId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate amount
    if (amount < 10) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Minimum amount is 10");
    }
    // Check if sender and receiver are different
    if (fromUserId.toString() === toUserId.toString()) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot send money to yourself");
    }
    // Check if sender wallet exists and is not blocked
    const fromWallet = yield wallet_service_1.WalletServices.getWalletByUserId(fromUserId);
    if (!fromWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender wallet not found");
    }
    if (fromWallet.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Sender wallet is blocked");
    }
    // Check if sender has sufficient balance
    if ((fromWallet.balance || 0) < amount) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
    }
    // Check if receiver wallet exists and is not blocked
    const toWallet = yield wallet_service_1.WalletServices.getWalletByUserId(toUserId);
    if (!toWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver wallet not found");
    }
    if (toWallet.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver wallet is blocked");
    }
    // Create transaction
    const transaction = yield transaction_model_1.Transaction.create({
        walletId: fromWalletId,
        type: transaction_types_1.TransactionType.SEND,
        initiatedBy: fromUserId,
        toWalletId: toWallet._id,
        amount,
        status: transaction_types_1.TransactionStatus.PENDING,
    });
    // Update both wallet balances
    yield wallet_service_1.WalletServices.updateWalletBalance(fromUserId, -amount);
    yield wallet_service_1.WalletServices.updateWalletBalance(toUserId, amount);
    // Update transaction status to completed
    yield transaction_model_1.Transaction.findByIdAndUpdate(transaction._id, { status: transaction_types_1.TransactionStatus.COMPLETED }, { new: true });
    return transaction;
});
// Withdraw money from wallet
const withdrawMoney = (walletId, userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate amount
    if (amount < 10) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Minimum amount is 10");
    }
    // Check if wallet exists and is not blocked
    const wallet = yield wallet_service_1.WalletServices.getWalletByUserId(userId);
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    if (wallet.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet is blocked");
    }
    // Check if user has sufficient balance
    if ((wallet.balance || 0) < amount) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
    }
    // Create transaction
    const transaction = yield transaction_model_1.Transaction.create({
        walletId,
        type: transaction_types_1.TransactionType.WITHDRAW,
        initiatedBy: userId,
        amount,
        status: transaction_types_1.TransactionStatus.PENDING,
    });
    // Update wallet balance
    yield wallet_service_1.WalletServices.updateWalletBalance(userId, -amount);
    // Update transaction status to completed
    yield transaction_model_1.Transaction.findByIdAndUpdate(transaction._id, { status: transaction_types_1.TransactionStatus.COMPLETED }, { new: true });
    return transaction;
});
// Get transaction history for a wallet
const getTransactionHistory = (walletId_1, ...args_1) => __awaiter(void 0, [walletId_1, ...args_1], void 0, function* (walletId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const transactions = yield transaction_model_1.Transaction.find({ walletId })
        .populate("initiatedBy", "name email")
        .populate("toWalletId", "userId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = yield transaction_model_1.Transaction.countDocuments({ walletId });
    const totalPages = Math.ceil(total / limit);
    return {
        transactions,
        total,
        page,
        totalPages,
    };
});
// Get transaction by ID
const getTransactionById = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield transaction_model_1.Transaction.findById(transactionId)
        .populate("initiatedBy", "name email")
        .populate("toWalletId", "userId");
    return transaction;
});
// Get all transactions (for admin)
const getAllTransactions = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, status, type) {
    const skip = (page - 1) * limit;
    const filter = {};
    if (status)
        filter.status = status;
    if (type)
        filter.type = type;
    const transactions = yield transaction_model_1.Transaction.find(filter)
        .populate("initiatedBy", "name email")
        .populate("toWalletId", "userId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = yield transaction_model_1.Transaction.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    return {
        transactions,
        total,
        page,
        totalPages,
    };
});
exports.TransactionServices = {
    addMoney,
    sendMoney,
    withdrawMoney,
    getTransactionHistory,
    getTransactionById,
    getAllTransactions,
};
