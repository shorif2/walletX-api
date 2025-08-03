import express from "express";
import { TransactionController } from "./transaction.controller";
import { checkAuth, checkAuthAndAgent } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { transactionValidation } from "./transaction.validation";

const router = express.Router();

// Add money to wallet
router.post(
  "/add",
  checkAuth("USER"),
  validateRequest(transactionValidation.addMoney),
  TransactionController.addMoney
);

// Send money to another user
router.post(
  "/send",
  checkAuth("USER", "ADMIN"),
  validateRequest(transactionValidation.sendMoney),
  TransactionController.sendMoney
);

// Withdraw money from wallet
router.post(
  "/withdraw",
  checkAuth("USER"),
  validateRequest(transactionValidation.withdrawMoney),
  TransactionController.withdrawMoney
);

// Agent cash-in: Add money to any user's wallet
router.post(
  "/cash-in",
  checkAuthAndAgent("AGENT"),
  validateRequest(transactionValidation.agentCashIn),
  TransactionController.agentCashIn
);

// Agent cash-out: Withdraw money from any user's wallet
router.post(
  "/cash-out",
  checkAuthAndAgent("AGENT"),
  validateRequest(transactionValidation.agentCashOut),
  TransactionController.agentCashOut
);

// Get my transaction history
router.get(
  "/my-history",
  checkAuth("USER", "ADMIN"),
  TransactionController.getMyTransactionHistory
);

// Get specific transaction by ID
router.get(
  "/:transactionId",
  checkAuth("USER", "ADMIN"),
  TransactionController.getTransactionById
);

// Get all transactions (admin only)
router.get("/", checkAuth("ADMIN"), TransactionController.getAllTransactions);

export const TransactionRoutes = router;
