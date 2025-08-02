"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentService = void 0;
const agent_model_1 = require("./agent.model");
const agent_types_1 = require("./agent.types");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const createAgent = (agentData, createdBy) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if agent with same email already exists
    const existingAgentByEmail = yield agent_model_1.Agent.findOne({ email: agentData.email });
    if (existingAgentByEmail) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "Agent with this email already exists");
    }
    // Hash the password
    const hashedPassword = yield bcryptjs_1.default.hash("123456", Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const newAgent = yield agent_model_1.Agent.create(Object.assign(Object.assign({}, agentData), { password: hashedPassword, createdBy, status: agent_types_1.AgentStatus.APPROVED }));
    return newAgent;
});
const getAllAgents = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}) {
    const query = {};
    if (filters.status) {
        query.status = filters.status;
    }
    if (filters.search) {
        query.$or = [
            { name: { $regex: filters.search, $options: "i" } },
            { email: { $regex: filters.search, $options: "i" } },
        ];
    }
    const agents = yield agent_model_1.Agent.find(query)
        .populate("createdBy", "name email")
        .populate("suspendedBy", "name email")
        .sort({ createdAt: -1 });
    return agents;
});
const getAgentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield agent_model_1.Agent.findById(id)
        .populate("createdBy", "name email")
        .populate("suspendedBy", "name email");
    if (!agent) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent not found");
    }
    return agent;
});
const updateAgentStatus = (id, statusData, updatedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield agent_model_1.Agent.findById(id);
    if (!agent) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent not found");
    }
    const updateData = {
        status: statusData.status,
    };
    // Handle different status updates
    switch (statusData.status) {
        case agent_types_1.AgentStatus.APPROVED:
            if (agent.status === agent_types_1.AgentStatus.APPROVED) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent is already approved");
            }
            // Clear suspension data if approving
            updateData.suspendedBy = null;
            updateData.suspensionReason = null;
            break;
        case agent_types_1.AgentStatus.SUSPENDED:
            if (agent.status === agent_types_1.AgentStatus.SUSPENDED) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent is already suspended");
            }
            if (!statusData.reason) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Suspension reason is required");
            }
            updateData.suspendedBy = updatedBy;
            updateData.suspensionReason = statusData.reason;
            break;
    }
    const updatedAgent = yield agent_model_1.Agent.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    })
        .populate("createdBy", "name email")
        .populate("suspendedBy", "name email");
    if (!updatedAgent) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent not found");
    }
    return updatedAgent;
});
const getAgentsByStatus = (status) => __awaiter(void 0, void 0, void 0, function* () {
    const agents = yield agent_model_1.Agent.find({ status })
        .populate("createdBy", "name email")
        .populate("suspendedBy", "name email")
        .sort({ createdAt: -1 });
    return agents;
});
const getApprovedAgents = () => __awaiter(void 0, void 0, void 0, function* () {
    return getAgentsByStatus(agent_types_1.AgentStatus.APPROVED);
});
const getSuspendedAgents = () => __awaiter(void 0, void 0, void 0, function* () {
    return getAgentsByStatus(agent_types_1.AgentStatus.SUSPENDED);
});
const updateAgent = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    // If password is being updated, hash it
    if (updateData.password) {
        updateData.password = yield bcryptjs_1.default.hash(updateData.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    }
    const agent = yield agent_model_1.Agent.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    })
        .populate("createdBy", "name email")
        .populate("suspendedBy", "name email");
    if (!agent) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent not found");
    }
    return agent;
});
const deleteAgent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield agent_model_1.Agent.findByIdAndDelete(id);
    if (!agent) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent not found");
    }
});
exports.AgentService = {
    createAgent,
    getAllAgents,
    getAgentById,
    updateAgent,
    updateAgentStatus,
    getApprovedAgents,
    getSuspendedAgents,
    deleteAgent,
};
