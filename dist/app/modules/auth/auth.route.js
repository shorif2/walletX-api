"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const express_1 = require("express");
// import passport from "passport";
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_types_1 = require("../user/user.types");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.AuthControllers.credentialsLogin);
router.post("/refresh-token", auth_controller_1.AuthControllers.getNewAccessToken);
router.post("/logout", auth_controller_1.AuthControllers.logout);
router.post("/reset-password", (0, checkAuth_1.checkAuth)(...Object.values(user_types_1.Role)), auth_controller_1.AuthControllers.resetPassword);
//  /booking -> /login -> succesful google login -> /booking frontend
// /login -> succesful google login -> / frontend
// router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
//     const redirect = req.query.redirect || "/"
//     passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
// })
// api/v1/auth/google/callback?state=/booking
// router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), AuthControllers.googleCallbackController)
exports.AuthRoutes = router;
