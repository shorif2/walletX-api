import { Wallet } from "../modules/wallet/wallet.model";

/**
 * Generates a unique wallet number
 * Format: WAL + 10 random digits (e.g., WAL1234567890)
 * @returns Promise<string> - A unique wallet number
 */
export const generateWalletNumber = async (): Promise<string> => {
  let walletNumber: string;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    // Generate a random 10-digit number
    const randomDigits = Math.floor(Math.random() * 9000000000) + 1000000000;
    walletNumber = `WAL${randomDigits}`;

    // Check if this wallet number already exists
    const existingWallet = await Wallet.findOne({ walletNumber });
    if (!existingWallet) {
      isUnique = true;
    } else {
      attempts++;
    }
  }

  if (!isUnique) {
    throw new Error(
      "Failed to generate unique wallet number after maximum attempts"
    );
  }

  return walletNumber!;
};

/**
 * Validates if a wallet number is in the correct format
 * @param walletNumber - The wallet number to validate
 * @returns boolean - True if valid, false otherwise
 */
export const validateWalletNumber = (walletNumber: string): boolean => {
  const walletNumberRegex = /^WAL\d{10}$/;
  return walletNumberRegex.test(walletNumber);
};
