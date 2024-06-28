import express from "express";
import { HelloController } from "../controller/hello.controller.js";
import { UserController } from "../controller/user.controller.js";
import { rateLimiterMiddleware } from "../middleware/rate-limiter.middleware.js";
// import { imageUploader } from "../middleware/file-disk-middleware.js";
import { fileUploader } from "../middleware/file-disk-middleware.js";

const publicRouter = express.Router();

const authRoute = "/api/auth";
const entry = "/";

publicRouter.get(entry, rateLimiterMiddleware, HelloController.getHello);
publicRouter.post(entry, rateLimiterMiddleware, fileUploader.single("image"), HelloController.sayHello);
publicRouter.post(authRoute + "/register", rateLimiterMiddleware, UserController.register);
publicRouter.post(authRoute + "/login", rateLimiterMiddleware, UserController.login);

export { publicRouter };
