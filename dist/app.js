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
const express_1 = __importDefault(require("express"));
const env_1 = require("./app/config/env");
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./app/routes");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const passport_1 = __importDefault(require("passport"));
require("./app/config/passport");
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const app = (0, express_1.default)();
// Session configuration with production-ready store
const sessionConfig = {
    secret: env_1.envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
    // Use MongoStore for production, MemoryStore for development
    store: process.env.NODE_ENV === "production"
        ? connect_mongo_1.default.create({
            mongoUrl: env_1.envVars.MONGO_URI,
            collectionName: "sessions",
            ttl: 24 * 60 * 60, // 24 hours in seconds
        })
        : undefined, // Use default MemoryStore in development
};
app.use((0, express_session_1.default)(sessionConfig));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // res.sendFile(path.join(__dirname, "./app/ui/index.html"));
    res.send("Hello from Wallet-X API!");
}));
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFound_1.default);
exports.default = app;
