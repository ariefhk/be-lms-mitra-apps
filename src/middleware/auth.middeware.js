import { ResponseHelper } from "../helper/response-json.helper.js";
import { API_STATUS_CODE } from "../helper/status-code.helper.js";
import { UserService } from "../service/user.service.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.get("Authorization")?.split("Bearer ")[1];
  if (!token) {
    return res.status(API_STATUS_CODE.UNAUTHORIZED).json(ResponseHelper.toJsonError("Unauthorized!")).end();
  } else {
    const user = await UserService.checkUserToken(token);
    req.user = user;
    next();
  }
};
