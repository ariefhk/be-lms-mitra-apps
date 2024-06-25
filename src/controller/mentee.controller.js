import { ResponseHelper } from "../helper/response-json.helper.js";
import { API_STATUS_CODE } from "../helper/status-code.helper.js";
import { MenteeService } from "../service/mentee.service.js";

export class MenteeController {
  static async list(req, res, next) {
    try {
      const user = req.user;

      const menteeRequest = {
        loggedRole: user.role,
        name: req?.query?.name,
      };

      const mentess = await MenteeService.list(menteeRequest);

      res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Succes Get Mentess!", mentess));
    } catch (error) {
      next(error);
    }
  }

  static async detail(req, res, next) {
    try {
      const user = req.user;

      const menteeRequest = {
        loggedRole: user.role,
        menteeId: req?.params?.menteeId ? Number(req?.params?.menteeId) : null,
      };

      const mentee = await MenteeService.detail(menteeRequest);

      res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Success Get Detail Mentee!", mentee));
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const user = req.user;

      const menteeRequest = {
        loggedRole: user.role,
        classId: req?.body?.classId ? Number(req?.body?.classId) : null,
        username: req?.body?.username,
        password: req?.body?.password,
        name: req?.body?.name,
        email: req?.body?.email,
        phoneNumber: req?.body?.phoneNumber,
        profilePicture: req?.body?.profilePicture,
        university: req?.body?.university,
        major: req?.body?.major,
        batch: req?.body?.batch,
      };

      const mentee = await MenteeService.create(menteeRequest);

      res.status(API_STATUS_CODE.CREATED).json(ResponseHelper.toJson("Success create mentee!", mentee));
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const user = req.user;

      const menteeRequest = {
        loggedRole: user.role,
        menteeId: req?.params?.menteeId ? Number(req?.params?.menteeId) : null,
        classId: req?.body?.classId ? Number(req?.body?.classId) : null,
        username: req?.body?.username,
        password: req?.body?.password,
        name: req?.body?.name,
        email: req?.body?.email,
        phoneNumber: req?.body?.phoneNumber,
        profilePicture: req?.body?.profilePicture,
        university: req?.body?.university,
        major: req?.body?.major,
        batch: req?.body?.batch,
      };

      const mentee = await MenteeService.update(menteeRequest);

      res.status(API_STATUS_CODE.CREATED).json(ResponseHelper.toJson("Success update mentee", mentee));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const user = req.user;

      const menteeRequest = {
        loggedRole: user.role,
        menteeId: req?.params?.menteeId ? Number(req?.params?.menteeId) : null,
      };

      await MenteeService.delete(menteeRequest);

      res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Success delete mentee!"));
    } catch (error) {
      next(error);
    }
  }
}
