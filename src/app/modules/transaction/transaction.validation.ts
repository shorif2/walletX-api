import z from "zod";

const addMoney = z.object({
  amount: z.number().min(10, "Minimum amount is 10"),
});

const sendMoney = z.object({
  toUserId: z.string().min(1, "Receiver user ID is required"),
  amount: z.number().min(10, "Minimum amount is 10"),
});

const withdrawMoney = z.object({
  amount: z.number().min(10, "Minimum amount is 10"),
});

export const transactionValidation = {
  addMoney,
  sendMoney,
  withdrawMoney,
};
