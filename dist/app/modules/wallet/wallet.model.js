"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const walletSchema = new mongoose_1.Schema({
    walletNumber: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 16,
    },
    balance: {
        type: Number,
        default: 50,
        min: 0,
    },
    accountType: {
        type: String,
        default: "Savings",
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Wallet = (0, mongoose_1.model)("Wallet", walletSchema);
