"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRoutes = void 0;
const express_1 = require("express");
const agent_controller_1 = require("./agent.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const agent_validation_1 = require("./agent.validation");
const user_types_1 = require("../user/user.types");
const router = (0, express_1.Router)();
// Create agent (Admin only)
router.post("/create", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN), 
//   validateRequest(AgentValidation.createAgentSchema),
agent_controller_1.AgentControllers.createAgent);
// Get all agents (Admin only)
router.get("/all", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN, user_types_1.Role.SUPER_ADMIN), agent_controller_1.AgentControllers.getAllAgents);
// Get agent by ID (Admin only)
router.get("/:id", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN, user_types_1.Role.SUPER_ADMIN), agent_controller_1.AgentControllers.getAgentById);
// Update agent (Admin only)
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN, user_types_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(agent_validation_1.AgentValidation.agentIdParamSchema), (0, validateRequest_1.validateRequest)(agent_validation_1.AgentValidation.updateAgentSchema), agent_controller_1.AgentControllers.updateAgent);
// Update agent status (Approve/Suspend) (Admin only)
router.patch("/:id/status", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN, user_types_1.Role.SUPER_ADMIN), 
//   validateRequest(AgentValidation.agentIdParamSchema),
//   validateRequest(AgentValidation.updateAgentStatusSchema),
agent_controller_1.AgentControllers.updateAgentStatus);
// Delete agent (Admin only)
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_types_1.Role.ADMIN, user_types_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(agent_validation_1.AgentValidation.agentIdParamSchema), agent_controller_1.AgentControllers.deleteAgent);
exports.AgentRoutes = router;
