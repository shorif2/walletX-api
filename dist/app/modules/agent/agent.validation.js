"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentValidation = void 0;
const zod_1 = require("zod");
const agent_types_1 = require("./agent.types");
const createAgentSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
        email: zod_1.z.string().email("Invalid email format"),
    }),
});
const updateAgentSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, "Name must be at least 2 characters").optional(),
        email: zod_1.z.string().email("Invalid email format").optional(),
    }),
});
const updateAgentStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(agent_types_1.AgentStatus),
        reason: zod_1.z.string().optional(),
    }),
});
const agentIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string()
            .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), "Invalid agent ID format"),
    }),
});
exports.AgentValidation = {
    createAgentSchema,
    updateAgentSchema,
    updateAgentStatusSchema,
    agentIdParamSchema,
};
