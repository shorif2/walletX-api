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
exports.startServer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_1.envVars.MONGO_URI);
        console.log("Connected to MongoDB");
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log(`Server is running on port ${env_1.envVars.PORT}`);
        });
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
exports.startServer = startServer;
startServer();
// handle unhandledRejection error
process.on("unhandledRejection", (err) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Unhandled rejection", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
}));
// handle unhandledRejection error
process.on("uncaughtException", (err) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("uncaughtException rejection", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
}));
// handle unhandledRejection error
process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("SIGTERM rejection");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
}));
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("SIGINT rejection");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
}));
