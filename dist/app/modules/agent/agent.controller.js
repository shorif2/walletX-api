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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const agent_service_1 = require("./agent.service");
const agent_types_1 = require("./agent.types");
const createAgent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const agentData = req.body;
    const createdBy = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!createdBy) {
        throw new Error("User not authenticated");
    }
    const result = yield agent_service_1.AgentService.createAgent(agentData, createdBy);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Agent created successfully",
        data: result,
    });
}));
const getAllAgents = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, search } = req.query;
    const filters = {};
    if (status) {
        filters.status = status;
    }
    if (search) {
        filters.search = search;
    }
    const result = yield agent_service_1.AgentService.getAllAgents(filters);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Agents retrieved successfully",
        data: result,
    });
}));
const getAgentById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield agent_service_1.AgentService.getAgentById(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Agent retrieved successfully",
        data: result,
    });
}));
const updateAgent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    const result = yield agent_service_1.AgentService.updateAgent(id, updateData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Agent updated successfully",
        data: result,
    });
}));
const updateAgentStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const statusData = req.body;
    console.log(req.body);
    const updatedBy = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!updatedBy) {
        throw new Error("User not authenticated");
    }
    const result = yield agent_service_1.AgentService.updateAgentStatus(id, statusData, updatedBy);
    let message = "Agent status updated successfully";
    switch (statusData.status) {
        case agent_types_1.AgentStatus.APPROVED:
            message = "Agent has been unsuspended and approved";
            break;
        case agent_types_1.AgentStatus.SUSPENDED:
            message = "Agent suspended successfully";
            break;
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message,
        data: result,
    });
}));
const deleteAgent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield agent_service_1.AgentService.deleteAgent(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Agent deleted successfully",
        data: null,
    });
}));
// const getSuspendedAgents = catchAsync(async (req: Request, res: Response) => {
//   const result = await AgentService.getSuspendedAgents();
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Suspended agents retrieved successfully",
//     data: result,
//   });
// });
exports.AgentControllers = {
    createAgent,
    getAllAgents,
    getAgentById,
    updateAgent,
    updateAgentStatus,
    deleteAgent,
};
