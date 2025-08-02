import z from "zod";

const updateBalance = z.object({
  amount: z.number().min(0, "Amount must be a positive number"),
});

const walletNumberSchema = z.object({
  walletNumber: z
    .string()
    .min(13, "Wallet number must be at least 13 characters")
    .max(16, "Wallet number must not exceed 16 characters")
    .regex(
      /^WAL\d{10}$/,
      "Wallet number must start with 'WAL' followed by 10 digits"
    ),
});

export const walletValidation = {
  updateBalance,
  walletNumber: walletNumberSchema,
};
