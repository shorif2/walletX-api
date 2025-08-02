import mongoose, { Schema } from "mongoose";
import { IAgent, AgentStatus } from "./agent.types";

const agentSchema = new Schema<IAgent>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      default: "AGENT",
    },
    status: {
      type: String,
      enum: Object.values(AgentStatus),
      default: AgentStatus.APPROVED,
    },

    totalTransactions: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    suspendedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    suspensionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Agent = mongoose.model<IAgent>("Agent", agentSchema);
