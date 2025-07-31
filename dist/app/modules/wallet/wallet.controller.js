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
exports.WalletController = void 0;
const wallet_service_1 = require("./wallet.service");
const catchAsync_1 = require("../../utils/catchAsync");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const getWalletByUserId = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const wallet = yield wallet_service_1.WalletServices.getWalletByUserId(userId);
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Wallet retrieved successfully",
        data: wallet,
    });
}));
const updateWalletBalance = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { amount } = req.body;
    if (!amount || typeof amount !== "number") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Valid amount is required");
    }
    const wallet = yield wallet_service_1.WalletServices.updateWalletBalance(userId, amount);
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Wallet balance updated successfully",
        data: wallet,
    });
}));
const blockWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const wallet = yield wallet_service_1.WalletServices.blockWallet(userId);
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Wallet blocked successfully",
        data: wallet,
    });
}));
const unblockWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const wallet = yield wallet_service_1.WalletServices.unblockWallet(userId);
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Wallet unblocked successfully",
        data: wallet,
    });
}));
exports.WalletController = {
    getWalletByUserId,
    updateWalletBalance,
    blockWallet,
    unblockWallet,
};
