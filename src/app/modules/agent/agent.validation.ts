import { z } from "zod";
import { AgentStatus } from "./agent.types";

const createAgentSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
  }),
});

const updateAgentSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Invalid email format").optional(),
  }),
});

const updateAgentStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(AgentStatus),
    reason: z.string().optional(),
  }),
});

const agentIdParamSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(
        (val) => /^[0-9a-fA-F]{24}$/.test(val),
        "Invalid agent ID format"
      ),
  }),
});

export const AgentValidation = {
  createAgentSchema,
  updateAgentSchema,
  updateAgentStatusSchema,
  agentIdParamSchema,
};
