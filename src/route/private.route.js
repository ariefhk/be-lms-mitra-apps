import express from "express";
import { UserController } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middeware.js";
import { AdminController } from "../controller/admin.controller.js";
const privateRouter = express.Router();

// prefix route
const userRoute = "/api/user";
const adminRoute = "/api/admin";

// User
privateRouter.get(userRoute + "/current", authMiddleware, UserController.current);

// Admin
privateRouter.get(adminRoute, authMiddleware, AdminController.list);
privateRouter.post(adminRoute, authMiddleware, AdminController.create);
privateRouter.get(adminRoute + "/:adminId", authMiddleware, AdminController.detail);
privateRouter.put(adminRoute + "/:adminId", authMiddleware, AdminController.update);
privateRouter.delete(adminRoute + "/:adminId", authMiddleware, AdminController.delete);

export { privateRouter };
