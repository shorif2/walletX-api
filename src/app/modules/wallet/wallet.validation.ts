import z from "zod";

const updateBalance = z.object({
  amount: z.number().min(0, "Amount must be a positive number"),
});

export const walletValidation = {
  updateBalance,
};
