import express from "express";
import { HelloController } from "../controller/hello.controller.js";
import { UserController } from "../controller/user.controller.js";

const publicRouter = express.Router();

const authRoute = "/api/auth";
const entry = "/";

publicRouter.get(entry, HelloController.sayHello);
publicRouter.post(authRoute + "/register", UserController.register);
publicRouter.post(authRoute + "/login", UserController.login);

export { publicRouter };
