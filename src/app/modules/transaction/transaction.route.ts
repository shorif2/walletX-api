import express from "express";
import { TransactionController } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { transactionValidation } from "./transaction.validation";

const router = express.Router();

// Add money to wallet
router.post(
  "/add",
  checkAuth("USER", "ADMIN", "SUPER_ADMIN", "AGENT"),
  validateRequest(transactionValidation.addMoney),
  TransactionController.addMoney
);

// Send money to another user
router.post(
  "/send",
  checkAuth("USER", "ADMIN", "SUPER_ADMIN", "AGENT"),
  validateRequest(transactionValidation.sendMoney),
  TransactionController.sendMoney
);

// Withdraw money from wallet
router.post(
  "/withdraw",
  checkAuth("USER", "ADMIN", "SUPER_ADMIN", "AGENT"),
  validateRequest(transactionValidation.withdrawMoney),
  TransactionController.withdrawMoney
);

// Get my transaction history
router.get(
  "/my-history",
  checkAuth("USER", "ADMIN", "SUPER_ADMIN", "AGENT"),
  TransactionController.getMyTransactionHistory
);

// Get specific transaction by ID
router.get(
  "/:transactionId",
  checkAuth("USER", "ADMIN", "SUPER_ADMIN", "AGENT"),
  TransactionController.getTransactionById
);

// Get all transactions (admin only)
router.get(
  "/",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  TransactionController.getAllTransactions
);

export const TransactionRoutes = router;
