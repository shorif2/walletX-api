import { Types } from "mongoose";

export enum AgentStatus {
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
}

export interface IAgent {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  status: AgentStatus;
  totalTransactions: number;
  createdBy?: Types.ObjectId;
  suspendedBy?: Types.ObjectId;
  suspensionReason?: string;
}

export interface IAgentCreateRequest {
  name: string;
  email: string;
  password: string;
}

export interface IAgentStatusUpdateRequest {
  status: AgentStatus;
  reason?: string;
}
