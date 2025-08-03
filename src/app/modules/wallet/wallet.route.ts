import express from "express";
import { WalletController } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { walletValidation } from "./wallet.validation";

const router = express.Router();

// Get wallet by user ID
router.get(
  "/user/:userId",
  checkAuth("USER", "ADMIN"),
  WalletController.getWalletByUserId
);

// Get wallet by wallet number
router.get(
  "/:walletNumber",
  checkAuth("USER", "ADMIN"),
  WalletController.getWalletByWalletNumber
);

// Update wallet balance
router.patch(
  "/:userId/balance",
  checkAuth("USER", "ADMIN", "AGENT"),
  validateRequest(walletValidation.updateBalance),
  WalletController.updateWalletBalance
);

// Block wallet
router.patch(
  "/:userId/block",
  checkAuth("ADMIN", "USER"),
  WalletController.blockWallet
);

// Unblock wallet
router.patch(
  "/:userId/unblock",
  checkAuth("ADMIN"),
  WalletController.unblockWallet
);

export const WalletRoutes = router;
