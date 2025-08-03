"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.resetPasswordZodSchema = zod_1.default.object({
    oldPassword: zod_1.default
        .string({ error: "Old Password must be string" })
        .min(8, { message: "Old Password must be at least 8 characters long." }),
    newPassword: zod_1.default
        .string({ error: "New Password must be string" })
        .min(8, { message: "New Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        message: "New Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "New Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "New Password must contain at least 1 number.",
    }),
});
