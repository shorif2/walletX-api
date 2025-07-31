import express from "express";
import { WalletController } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { walletValidation } from "./wallet.validation";

const router = express.Router();

// Get wallet by user ID
router.get(
  "/:userId",
  checkAuth("USER", "ADMIN", "SUPER_ADMIN", "AGENT"),
  WalletController.getWalletByUserId
);

// Update wallet balance
router.patch(
  "/:userId/balance",
  checkAuth("USER", "ADMIN", "SUPER_ADMIN", "AGENT"),
  validateRequest(walletValidation.updateBalance),
  WalletController.updateWalletBalance
);

// Block wallet
router.patch(
  "/:userId/block",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  WalletController.blockWallet
);

// Unblock wallet
router.patch(
  "/:userId/unblock",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  WalletController.unblockWallet
);

export const WalletRoutes = router;
