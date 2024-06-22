import express from "express";
import { UserController } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middeware.js";
import { AdminController } from "../controller/admin.controller.js";
import { SeniorMentorController } from "../controller/senior-mentor.controller.js";
const privateRouter = express.Router();

// prefix route
const userRoute = "/api/user";
const adminRoute = "/api/admin";
const seniorMentorRoute = "/api/senior-mentor";

// User
privateRouter.get(userRoute + "/current", authMiddleware, UserController.current);

// Admin
privateRouter.get(adminRoute, authMiddleware, AdminController.list);
privateRouter.post(adminRoute, authMiddleware, AdminController.create);
privateRouter.get(adminRoute + "/:adminId", authMiddleware, AdminController.detail);
privateRouter.put(adminRoute + "/:adminId", authMiddleware, AdminController.update);
privateRouter.delete(adminRoute + "/:adminId", authMiddleware, AdminController.delete);

// Senior Mentor
privateRouter.get(seniorMentorRoute, authMiddleware, SeniorMentorController.list);
privateRouter.post(seniorMentorRoute, authMiddleware, SeniorMentorController.create);
privateRouter.get(seniorMentorRoute + "/:seniorMentorId", authMiddleware, SeniorMentorController.detail);
privateRouter.put(seniorMentorRoute + "/:seniorMentorId", authMiddleware, SeniorMentorController.update);
privateRouter.delete(seniorMentorRoute + "/:seniorMentorId", authMiddleware, SeniorMentorController.delete);

export { privateRouter };
