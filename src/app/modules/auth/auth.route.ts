// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NextFunction, Request, Response, Router } from "express";
// import passport from "passport";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.types";
import { AuthControllers } from "./auth.controller";
import { resetPasswordZodSchema } from "./auth.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
router.post(
  "/reset-password",
  checkAuth(Role.USER),
  validateRequest(resetPasswordZodSchema),
  AuthControllers.resetPassword
);

export const AuthRoutes = router;
