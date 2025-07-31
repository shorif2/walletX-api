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

const app = express();

// Configure session store based on environment
const sessionConfig: any = {
  secret: envVars.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// For production/serverless, use a more suitable session store
if (process.env.NODE_ENV === "production") {
  // Disable sessions for serverless or use a stateless approach
  sessionConfig.store = false;
  sessionConfig.unset = "destroy";
}

app.use(expressSession(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());

// Configure CORS for production
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [envVars.FRONTEND_URL, "https://*.vercel.app"]
        : true,
    credentials: true,
  })
);

app.use("/api/v1", router);

app.get("/", async (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "./app/ui/index.html"));
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
