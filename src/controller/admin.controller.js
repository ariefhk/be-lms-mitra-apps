import { ResponseHelper } from "../helper/response-json.helper.js";
import { API_STATUS_CODE } from "../helper/status-code.helper.js";
import { AdminService } from "../service/admin.service.js";

export class AdminController {
  static async list(req, res, next) {
    try {
      const user = req.user;

      const adminRequest = {
        loggedRole: user.role,
      };

      const admins = await AdminService.list(adminRequest);

      return res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Success Get Admins", admins));
    } catch (error) {
      next(error);
    }
  }

  static async detail(req, res, next) {
    try {
      const user = req.user;

      const adminRequest = {
        loggedRole: user.role,
        adminId: req?.params?.adminId ? Number(req?.params?.adminId) : null,
      };

      const admins = await AdminService.detail(adminRequest);

      return res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Success Get Admins", admins));
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const user = req.user;

      const adminRequest = {
        loggedRole: user.role,
        username: req?.body?.username,
        password: req?.body?.password,
        role: "ADMIN",
        name: req?.body?.name,
        email: req?.body?.email,
        phoneNumber: req?.body?.phoneNumber,
        profilePicture: req?.body?.profilePicture,
      };

      const admin = await AdminService.create(adminRequest);

      return res.status(API_STATUS_CODE.CREATED).json(ResponseHelper.toJson("Success create Admin", admin));
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const user = req.user;

      const adminRequest = {
        loggedRole: user.role,
        adminId: req?.params?.adminId ? Number(req?.params?.adminId) : null,
        name: req?.body?.name,
        email: req?.body?.email,
        phoneNumber: req?.body?.phoneNumber,
        profilePicture: req?.body?.profilePicture,
      };

      const admin = await AdminService.update(adminRequest);

      return res.status(API_STATUS_CODE.CREATED).json(ResponseHelper.toJson("Success update Admin", admin));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const user = req.user;

      const adminRequest = {
        loggedRole: user.role,
        adminId: req?.params?.adminId ? Number(req?.params?.adminId) : null,
      };

      await AdminService.delete(adminRequest);

      return res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Success Delete Admin!"));
    } catch (error) {
      next(error);
    }
  }
}
