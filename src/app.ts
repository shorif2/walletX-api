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

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", async (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "./app/ui/index.html"));
});

app.use(globalErrorHandler);

app.use(notFound);
export default app;
