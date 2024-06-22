import express from "express";
import { HelloController } from "../controller/hello.controller.js";
import { UserController } from "../controller/user.controller.js";
import { rateLimiterMiddleware } from "../middleware/rate-limiter.middleware.js";

const publicRouter = express.Router();

const authRoute = "/api/auth";
const entry = "/";

publicRouter.get(entry, rateLimiterMiddleware, HelloController.sayHello);
publicRouter.post(authRoute + "/register", rateLimiterMiddleware, UserController.register);
publicRouter.post(authRoute + "/login", rateLimiterMiddleware, UserController.login);

export { publicRouter };
