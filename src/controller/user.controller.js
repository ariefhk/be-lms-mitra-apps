import { UserService } from "../service/user.service.js";
import { ResponseHelper } from "../helper/response-json.helper.js";
import { API_STATUS_CODE } from "../helper/status-code.helper.js";

export class UserController {
  static async register(req, res, next) {
    try {
      const userRequest = {
        username: req?.body?.username,
        name: req?.body?.name,
        role: req?.body?.role,
        password: req?.body?.password,
      };

      const registerUser = await UserService.register(userRequest);
      return res.status(API_STATUS_CODE.CREATED).json(ResponseHelper.toJson("Success Create User", registerUser));
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const userRequest = {
        username: req?.body?.username,
        password: req?.body?.password,
      };
      const loginUser = await UserService.login(userRequest);
      return res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Success Login User", loginUser));
    } catch (error) {
      next(error);
    }
  }

  static async current(req, res, next) {
    try {
      const user = req.user;
      return res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Success get User", user));
    } catch (error) {
      next(error);
    }
  }
}
