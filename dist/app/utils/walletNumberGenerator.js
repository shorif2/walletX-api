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
exports.validateWalletNumber = exports.generateWalletNumber = void 0;
const wallet_model_1 = require("../modules/wallet/wallet.model");
/**
 * Generates a unique wallet number
 * Format: WAL + 10 random digits (e.g., WAL1234567890)
 * @returns Promise<string> - A unique wallet number
 */
const generateWalletNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    let walletNumber;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;
    while (!isUnique && attempts < maxAttempts) {
        // Generate a random 10-digit number
        const randomDigits = Math.floor(Math.random() * 9000000000) + 1000000000;
        walletNumber = `WAL${randomDigits}`;
        // Check if this wallet number already exists
        const existingWallet = yield wallet_model_1.Wallet.findOne({ walletNumber });
        if (!existingWallet) {
            isUnique = true;
        }
        else {
            attempts++;
        }
    }
    if (!isUnique) {
        throw new Error("Failed to generate unique wallet number after maximum attempts");
    }
    return walletNumber;
});
exports.generateWalletNumber = generateWalletNumber;
/**
 * Validates if a wallet number is in the correct format
 * @param walletNumber - The wallet number to validate
 * @returns boolean - True if valid, false otherwise
 */
const validateWalletNumber = (walletNumber) => {
    const walletNumberRegex = /^WAL\d{10}$/;
    return walletNumberRegex.test(walletNumber);
};
exports.validateWalletNumber = validateWalletNumber;
