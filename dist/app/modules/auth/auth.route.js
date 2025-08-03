"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const express_1 = require("express");
// import passport from "passport";
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_types_1 = require("../user/user.types");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const validateRequest_1 = require("../../middlewares/validateRequest");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.AuthControllers.credentialsLogin);
router.post("/refresh-token", auth_controller_1.AuthControllers.getNewAccessToken);
router.post("/logout", auth_controller_1.AuthControllers.logout);
router.post("/reset-password", (0, checkAuth_1.checkAuth)(user_types_1.Role.USER), (0, validateRequest_1.validateRequest)(auth_validation_1.resetPasswordZodSchema), auth_controller_1.AuthControllers.resetPassword);
exports.AuthRoutes = router;
