"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = __importDefault(require("express"));
const wallet_controller_1 = require("./wallet.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const wallet_validation_1 = require("./wallet.validation");
const router = express_1.default.Router();
// Get wallet by user ID
router.get("/user/:userId", (0, checkAuth_1.checkAuth)("USER", "ADMIN"), wallet_controller_1.WalletController.getWalletByUserId);
// Get wallet by wallet number
router.get("/:walletNumber", (0, checkAuth_1.checkAuth)("USER", "ADMIN"), wallet_controller_1.WalletController.getWalletByWalletNumber);
// Update wallet balance
router.patch("/:userId/balance", (0, checkAuth_1.checkAuth)("USER", "ADMIN", "AGENT"), (0, validateRequest_1.validateRequest)(wallet_validation_1.walletValidation.updateBalance), wallet_controller_1.WalletController.updateWalletBalance);
// Block wallet
router.patch("/:userId/block", (0, checkAuth_1.checkAuth)("ADMIN", "USER"), wallet_controller_1.WalletController.blockWallet);
// Unblock wallet
router.patch("/:userId/unblock", (0, checkAuth_1.checkAuth)("ADMIN"), wallet_controller_1.WalletController.unblockWallet);
exports.WalletRoutes = router;
