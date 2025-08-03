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
exports.UserControllers = void 0;
const user_service_1 = require("./user.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserServices.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Created Successfully",
        data: user,
    });
}));
// get all users
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.getAllUsers();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta,
    });
}));
// get single user by id
const getUserById = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Validate if the ID is a valid ObjectId
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid user ID format");
    }
    const user = yield user_service_1.UserServices.getUserById(new mongoose_1.Types.ObjectId(id));
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Retrieved Successfully",
        data: user,
    });
}));
const getMyProfile = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not authenticated");
    }
    // Validate if the userId is a valid ObjectId
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid user ID format");
    }
    const user = yield user_service_1.UserServices.getUserById(new mongoose_1.Types.ObjectId(userId));
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User profile fetched successfully",
        data: user,
    });
}));
const updateUserProfile = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const allowedFields = ["name", "email", "password"];
    const updateData = {};
    for (const key of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(req.body, key)) {
            updateData[key] = req.body[key];
        }
    }
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not authenticated");
    }
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid user ID format");
    }
    const updatedUser = yield user_service_1.UserServices.updateUserProfile(new mongoose_1.Types.ObjectId(userId), updateData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Profile updated successfully",
        data: updatedUser,
    });
}));
const blockUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid user ID");
    }
    const updatedUser = yield user_service_1.UserServices.setUserBlockStatus(new mongoose_1.Types.ObjectId(id), true);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User has been blocked",
        data: updatedUser,
    });
}));
const unblockUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid user ID");
    }
    const updatedUser = yield user_service_1.UserServices.setUserBlockStatus(new mongoose_1.Types.ObjectId(id), false);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User has been unblocked",
        data: updatedUser,
    });
}));
exports.UserControllers = {
    createUser,
    getAllUsers,
    getUserById,
    getMyProfile,
    updateUserProfile,
    unblockUser,
    blockUser,
};
