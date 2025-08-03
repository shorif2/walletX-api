import { Router } from "express";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.types";

const router = Router();

router.post("/register", UserControllers.createUser);
router.get("/all-users", checkAuth(Role.ADMIN), UserControllers.getAllUsers);
router.get("/me", checkAuth(Role.USER), UserControllers.getMyProfile);
router.patch(
  "/profile",
  checkAuth(Role.USER, Role.ADMIN),
  UserControllers.updateUserProfile
);
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.USER),
  UserControllers.getUserById
);

router.patch("/:id/block", checkAuth(Role.ADMIN), UserControllers.blockUser);

router.patch(
  "/:id/unblock",
  checkAuth(Role.ADMIN),
  UserControllers.unblockUser
);

export const UserRoutes = router;
