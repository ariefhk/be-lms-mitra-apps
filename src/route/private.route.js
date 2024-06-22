import express from "express";
import { UserController } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middeware.js";
const privateRouter = express.Router();

// user
const userRoute = "/api/user";

privateRouter.get(userRoute + "/current", authMiddleware, UserController.current);

export { privateRouter };
