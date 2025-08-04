import { Router } from "express";
import { AgentControllers } from "./agent.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { AgentValidation } from "./agent.validation";
import { Role } from "../user/user.types";

const router = Router();

// Create agent (Admin only)
router.post(
  "/create",
  checkAuth(Role.ADMIN),
  //   validateRequest(AgentValidation.createAgentSchema),
  AgentControllers.createAgent
);

// Get all agents (Admin only)
router.get(
  "/all",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AgentControllers.getAllAgents
);

// Get agent by ID (Admin only)
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AgentControllers.getAgentById
);

// Update agent (Admin only)
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(AgentValidation.agentIdParamSchema),
  validateRequest(AgentValidation.updateAgentSchema),
  AgentControllers.updateAgent
);

// Update agent status (Approve/Reject) (Admin only)
router.patch(
  "/:id/status",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  //   validateRequest(AgentValidation.agentIdParamSchema),
  //   validateRequest(AgentValidation.updateAgentStatusSchema),
  AgentControllers.updateAgentStatus
);

export const AgentRoutes = router;
