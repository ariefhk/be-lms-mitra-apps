import { ResponseHelper } from "../helper/response-json.helper.js";
import { API_STATUS_CODE } from "../helper/status-code.helper.js";

export class SeniorMentorController {
  static async list(req, res, next) {
    try {
      const user = req.user;

      const seniorMentorRequest = {
        role: user.role,
      };

      res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Hello from API!"));
    } catch (error) {
      next(error);
    }
  }

  static async detail(req, res, next) {
    try {
      const user = req.user;

      const seniorMentorRequest = {
        role: user.role,
        seniorMentorId: req?.params?.seniorMentorId ? Number(req?.params?.seniorMentorId) : null,
      };

      res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Hello from API!"));
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const user = req.user;

      const seniorMentorRequest = {
        role: user.role,
      };

      res.status(API_STATUS_CODE.CREATED).json(ResponseHelper.toJson("Hello from API!"));
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const user = req.user;

      const seniorMentorRequest = {
        role: user.role,
        seniorMentorId: req?.params?.seniorMentorId ? Number(req?.params?.seniorMentorId) : null,
      };

      res.status(API_STATUS_CODE.CREATED).json(ResponseHelper.toJson("Hello from API!"));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const user = req.user;

      const seniorMentorRequest = {
        role: user.role,
        seniorMentorId: req?.params?.seniorMentorId ? Number(req?.params?.seniorMentorId) : null,
      };

      res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Hello from API!"));
    } catch (error) {
      next(error);
    }
  }
}
