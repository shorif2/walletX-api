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
exports.TransactionController = void 0;
const transaction_service_1 = require("./transaction.service");
const catchAsync_1 = require("../../utils/catchAsync");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const wallet_service_1 = require("../wallet/wallet.service");
// id issue here
// Add money to wallet
const addMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { amount } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not authenticated");
    }
    // Get user's wallet
    const wallet = yield wallet_service_1.WalletServices.getWalletByUserId(userId);
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    const transaction = yield transaction_service_1.TransactionServices.addMoney(wallet._id, userId, amount);
    res.status(http_status_codes_1.default.CREATED).json({
        success: true,
        message: "Money added successfully",
        data: transaction,
    });
}));
// Send money to another user
const sendMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { toUserId, amount } = req.body;
    const fromUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!fromUserId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not authenticated");
    }
    // Get sender's wallet
    const fromWallet = yield wallet_service_1.WalletServices.getWalletByUserId(fromUserId);
    if (!fromWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender wallet not found");
    }
    const transaction = yield transaction_service_1.TransactionServices.sendMoney(fromWallet._id, fromUserId, toUserId, amount);
    res.status(http_status_codes_1.default.CREATED).json({
        success: true,
        message: "Money sent successfully",
        data: transaction,
    });
}));
// Withdraw money from wallet
const withdrawMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { amount } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not authenticated");
    }
    // Get user's wallet
    const wallet = yield wallet_service_1.WalletServices.getWalletByUserId(userId);
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    const transaction = yield transaction_service_1.TransactionServices.withdrawMoney(wallet._id, userId, amount);
    res.status(http_status_codes_1.default.CREATED).json({
        success: true,
        message: "Money withdrawn successfully",
        data: transaction,
    });
}));
// Get transaction history for current user
const getMyTransactionHistory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not authenticated");
    }
    // Get user's wallet
    const wallet = yield wallet_service_1.WalletServices.getWalletByUserId(userId);
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    const result = yield transaction_service_1.TransactionServices.getTransactionHistory(wallet._id, page, limit);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Transaction history retrieved successfully",
        data: result.transactions,
        meta: {
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
            limit,
        },
    });
}));
// Get specific transaction by ID
const getTransactionById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { transactionId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not authenticated");
    }
    const transaction = yield transaction_service_1.TransactionServices.getTransactionById(transactionId);
    if (!transaction) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Transaction not found");
    }
    // Check if user owns this transaction or is admin
    if (transaction.initiatedBy.toString() !== userId.toString() &&
        ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "ADMIN" &&
        ((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) !== "SUPER_ADMIN") {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Access denied");
    }
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Transaction retrieved successfully",
        data: transaction,
    });
}));
// Get all transactions (admin only)
const getAllTransactions = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const type = req.query.type;
    const result = yield transaction_service_1.TransactionServices.getAllTransactions(page, limit, status, type);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "All transactions retrieved successfully",
        data: result.transactions,
        meta: {
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
            limit,
        },
    });
}));
exports.TransactionController = {
    addMoney,
    sendMoney,
    withdrawMoney,
    getMyTransactionHistory,
    getTransactionById,
    getAllTransactions,
};
