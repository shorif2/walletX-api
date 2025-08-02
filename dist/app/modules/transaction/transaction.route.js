"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("./transaction.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const transaction_validation_1 = require("./transaction.validation");
const router = express_1.default.Router();
// Add money to wallet
router.post("/add", (0, checkAuth_1.checkAuth)("USER"), (0, validateRequest_1.validateRequest)(transaction_validation_1.transactionValidation.addMoney), transaction_controller_1.TransactionController.addMoney);
// Send money to another user
router.post("/send", (0, checkAuth_1.checkAuth)("USER"), (0, validateRequest_1.validateRequest)(transaction_validation_1.transactionValidation.sendMoney), transaction_controller_1.TransactionController.sendMoney);
// Withdraw money from wallet
router.post("/withdraw", (0, checkAuth_1.checkAuth)("USER"), (0, validateRequest_1.validateRequest)(transaction_validation_1.transactionValidation.withdrawMoney), transaction_controller_1.TransactionController.withdrawMoney);
// Agent cash-in: Add money to any user's wallet
router.post("/cash-in", (0, checkAuth_1.checkAuthAndAgent)("AGENT"), (0, validateRequest_1.validateRequest)(transaction_validation_1.transactionValidation.agentCashIn), transaction_controller_1.TransactionController.agentCashIn);
// Agent cash-out: Withdraw money from any user's wallet
router.post("/cash-out", (0, checkAuth_1.checkAuthAndAgent)("AGENT"), (0, validateRequest_1.validateRequest)(transaction_validation_1.transactionValidation.agentCashOut), transaction_controller_1.TransactionController.agentCashOut);
// Get my transaction history
router.get("/my-history", (0, checkAuth_1.checkAuth)("USER"), transaction_controller_1.TransactionController.getMyTransactionHistory);
// Get specific transaction by ID
router.get("/:transactionId", (0, checkAuth_1.checkAuth)("USER", "ADMIN"), transaction_controller_1.TransactionController.getTransactionById);
// Get all transactions (admin only)
router.get("/", (0, checkAuth_1.checkAuth)("ADMIN", "SUPER_ADMIN"), transaction_controller_1.TransactionController.getAllTransactions);
exports.TransactionRoutes = router;
