import express, { Request, Response } from "express";
import { envVars } from "./app/config/env";
import expressSession from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import passport from "passport";
import "./app/config/passport";
import path from "path";
import MongoStore from "connect-mongo";

const app = express();

// Session configuration with production-ready store
const sessionConfig: expressSession.SessionOptions = {
  secret: envVars.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  // Use MongoStore for production, MemoryStore for development
  store:
    process.env.NODE_ENV === "production"
      ? MongoStore.create({
          mongoUrl: envVars.MONGO_URI,
          collectionName: "sessions",
          ttl: 24 * 60 * 60, // 24 hours in seconds
        })
      : undefined, // Use default MemoryStore in development
};

app.use(expressSession(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", async (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "./app/ui/index.html"));
  // res.send("Hello from Wallet-X API!");
});

app.use(globalErrorHandler);

app.use(notFound);
export default app;
