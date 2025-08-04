import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AgentService } from "./agent.service";
import { AgentStatus } from "./agent.types";

const createAgent = catchAsync(async (req: Request, res: Response) => {
  const agentData = req.body;
  const createdBy = req.user?._id;

  if (!createdBy) {
    throw new Error("User not authenticated");
  }

  const result = await AgentService.createAgent(agentData, createdBy);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Agent created successfully",
    data: result,
  });
});

const getAllAgents = catchAsync(async (req: Request, res: Response) => {
  const { status, search } = req.query;

  const filters: { status?: AgentStatus; search?: string } = {};
  if (status) {
    filters.status = status as AgentStatus;
  }
  if (search) {
    filters.search = search as string;
  }

  const result = await AgentService.getAllAgents(filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Agents retrieved successfully",
    data: result,
  });
});

const getAgentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AgentService.getAgentById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Agent retrieved successfully",
    data: result,
  });
});

const updateAgent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await AgentService.updateAgent(id, updateData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Agent updated successfully",
    data: result,
  });
});

const updateAgentStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await AgentService.updateAgentStatus(id, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Agent has been ${result.isApproved?.toLocaleLowerCase()} successfully`,
    data: result,
  });
});

const deleteAgent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  await AgentService.deleteAgent(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Agent deleted successfully",
    data: null,
  });
});

export const AgentControllers = {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  updateAgentStatus,
  deleteAgent,
};
