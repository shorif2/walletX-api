import { Types } from "mongoose";
import { Agent } from "./agent.model";
import { IAgent, AgentStatus, IAgentCreateRequest } from "./agent.types";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { User } from "../user/user.model";
import { isApproved, IUser } from "../user/user.types";

const createAgent = async (
  agentData: IAgentCreateRequest,
  createdBy: Types.ObjectId
): Promise<IAgent> => {
  // Check if agent with same email already exists
  const isAgentExist = await Agent.findOne({ email: agentData.email });
  const isUserExist = await User.findOne({ email: agentData.email });
  if (isAgentExist || isUserExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Agent with this email already exists"
    );
  }

  // Hash the password
  const hashedPassword = await bcryptjs.hash(
    "123456",
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const newAgent = await Agent.create({
    ...agentData,
    password: hashedPassword,
    createdBy,
    status: AgentStatus.APPROVED,
  });
  return newAgent;
};

const getAllAgents = async (
  filters: {
    status?: AgentStatus;
    search?: string;
  } = {}
): Promise<IAgent[]> => {
  const query: Record<string, unknown> = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
    ];
  }

  const agents = await Agent.find(query)
    .populate("createdBy", "name email")
    .populate("suspendedBy", "name email")
    .sort({ createdAt: -1 });

  return agents;
};

const getAgentById = async (id: string): Promise<IAgent> => {
  const agent = await Agent.findById(id)
    .populate("createdBy", "name email")
    .populate("suspendedBy", "name email");

  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }

  return agent;
};

const updateAgentStatus = async (
  id: string,
  status: isApproved
): Promise<IUser> => {
  const agent = await User.findById(id).select("-updatedAt -password");
  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }
  if (agent.isApproved === status) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Agent is already ${status.toLocaleLowerCase()}`
    );
  }
  const updatedAgent = await User.findByIdAndUpdate(
    id,
    { isApproved: status },
    {
      new: true,
      runValidators: true,
    }
  );
  return updatedAgent as IUser;
};

const getAgentsByStatus = async (status: AgentStatus): Promise<IAgent[]> => {
  const agents = await Agent.find({ status })
    .populate("createdBy", "name email")
    .populate("suspendedBy", "name email")
    .sort({ createdAt: -1 });

  return agents;
};

const getApprovedAgents = async (): Promise<IAgent[]> => {
  return getAgentsByStatus(AgentStatus.APPROVED);
};

const getSuspendedAgents = async (): Promise<IAgent[]> => {
  return getAgentsByStatus(AgentStatus.SUSPENDED);
};

const updateAgent = async (
  id: string,
  updateData: Partial<IAgent>
): Promise<IAgent> => {
  // If password is being updated, hash it
  if (updateData.password) {
    updateData.password = await bcryptjs.hash(
      updateData.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const agent = await Agent.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("createdBy", "name email")
    .populate("suspendedBy", "name email");

  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }

  return agent;
};

const deleteAgent = async (id: string): Promise<void> => {
  const agent = await Agent.findByIdAndDelete(id);

  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }
};

export const AgentService = {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  updateAgentStatus,
  getApprovedAgents,
  getSuspendedAgents,
  deleteAgent,
};
