import z from "zod";

const addMoney = z.object({
  amount: z.number().min(10, "Minimum amount is 10"),
});

const sendMoney = z.object({
  recieverWallet: z
    .string()
    .min(13, "Wallet number must be at least 13 characters")
    .max(16, "Wallet number must not exceed 16 characters")
    .regex(
      /^WAL\d{10}$/,
      "Wallet number must start with 'WAL' followed by 10 digits"
    ),
  amount: z.number().min(10, "Minimum amount is 10"),
  note: z.string().optional(),
});

const withdrawMoney = z.object({
  amount: z.number().min(10, "Minimum amount is 10"),
  note: z.string().optional(),
});

const agentCashIn = z.object({
  walletNumber: z.string().min(1, "Target user ID is required"),
  amount: z.number().min(10, "Minimum amount is 10"),
  note: z.string().optional(),
});

const agentCashOut = z.object({
  walletNumber: z.string().min(1, "Target user ID is required"),
  amount: z.number().min(10, "Minimum amount is 10"),
  note: z.string().optional(),
});

export const transactionValidation = {
  addMoney,
  sendMoney,
  withdrawMoney,
  agentCashIn,
  agentCashOut,
};
