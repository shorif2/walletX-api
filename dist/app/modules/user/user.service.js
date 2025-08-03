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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const wallet_service_1 = require("../wallet/wallet.service");
const agent_model_1 = require("../agent/agent.model");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    const isAgentExist = yield agent_model_1.Agent.findOne({ email });
    if (isUserExist || isAgentExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exist");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword }, rest));
    // Automatically create wallet for the new user
    try {
        const wallet = yield wallet_service_1.WalletServices.createWallet(user._id);
        // Update user with wallet reference
        const updateUser = yield user_model_1.User.findByIdAndUpdate(user._id, {
            wallet: wallet._id,
        }, { new: true }).select("-password -updatedAt");
        return updateUser;
    }
    catch (error) {
        // If wallet creation fails,  throw an error
        // For now, we'll log the error but not fail the user creation
        console.error("Failed to create wallet for user:", user._id, error);
    }
});
//get all users
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({})
        .populate({
        path: "wallet",
        select: ["walletNumber", "balance", "isBlocked", "-_id"],
    })
        .select("-password -updatedAt");
    const totalUsers = yield user_model_1.User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers,
        },
    };
});
// Get user by ID
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId)
        .populate({
        path: "wallet",
        select: ["walletNumber", "balance", "isBlocked", "-_id"],
    })
        .select(["-updatedAt", "-password"]);
    return user;
});
const updateUserProfile = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    })
        .select("-password -updatedAt")
        .populate({
        path: "wallet",
        select: ["walletNumber", "balance", "isBlocked", "-_id"],
    });
    return user;
});
const setUserBlockStatus = (userId, block) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findByIdAndUpdate(userId, { isBlocked: block }, { new: true, runValidators: true })
        .select("-password -updatedAt")
        .populate({
        path: "wallet",
        select: ["walletNumber", "balance", "isBlocked", "-_id"],
    });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    return user;
});
exports.UserServices = {
    createUser,
    getAllUsers,
    getUserById,
    updateUserProfile,
    setUserBlockStatus,
};
