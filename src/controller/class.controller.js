import { ResponseHelper } from "../helper/response-json.helper.js";
import { API_STATUS_CODE } from "../helper/status-code.helper.js";
import { ClassService } from "../service/class.service.js";

export class ClassController {
  static async list(req, res, next) {
    try {
      const user = req.user;

      const classesRequest = {
        loggedRole: user.role,
        name: req?.query?.name,
      };

      const classes = await ClassService.list(classesRequest);

      res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Success Get All Class", classes));
    } catch (error) {
      next(error);
    }
  }

  static async detail(req, res, next) {
    try {
      const user = req.user;

      const classesRequest = {
        loggedRole: user.role,
        classId: req?.params?.classId ? Number(req?.params?.classId) : null,
      };

      const classes = await ClassService.detail(classesRequest);

      res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Success Get Detail Class", classes));
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const user = req.user;

      const classesRequest = {
        loggedRole: user.role,
        name: req?.body?.name,
        mentorId: req?.body?.mentorId ? Number(req?.body?.mentorId) : null,
      };

      const classes = await ClassService.create(classesRequest);

      res.status(API_STATUS_CODE.CREATED).json(ResponseHelper.toJson("Success Create Class", classes));
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const user = req.user;

      const classesRequest = {
        loggedRole: user.role,
        classId: req?.params?.classId ? Number(req?.params?.classId) : null,
        name: req?.body?.name,
        mentorId: req?.body?.mentorId ? Number(req?.body?.mentorId) : null,
      };

      const classes = await ClassService.update(classesRequest);

      res.status(API_STATUS_CODE.CREATED).json(ResponseHelper.toJson("Success Update Class", classes));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const user = req.user;

      const classesRequest = {
        loggedRole: user.role,
        classId: req?.params?.classId ? Number(req?.params?.classId) : null,
      };

      const classes = await ClassService.delete(classesRequest);

      res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Success Delete Class!", classes));
    } catch (error) {
      next(error);
    }
  }
}
