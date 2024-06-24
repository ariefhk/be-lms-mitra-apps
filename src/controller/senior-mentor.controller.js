import { ResponseHelper } from "../helper/response-json.helper.js";
import { API_STATUS_CODE } from "../helper/status-code.helper.js";
import { SeniorMentorService } from "../service/senior-mentor.service.js";

export class SeniorMentorController {
  static async list(req, res, next) {
    try {
      const user = req.user;

      const seniorMentorRequest = {
        loggedRole: user.role,
        name: req?.query?.name,
      };

      const seniorMentors = await SeniorMentorService.list(seniorMentorRequest);

      res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Success Get All Senior Mentor", seniorMentors));
    } catch (error) {
      next(error);
    }
  }

  static async detail(req, res, next) {
    try {
      const user = req.user;

      const seniorMentorRequest = {
        loggedRole: user.role,
        seniorMentorId: req?.params?.seniorMentorId ? Number(req?.params?.seniorMentorId) : null,
      };

      const seniorMentor = await SeniorMentorService.detail(seniorMentorRequest);

      res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Success Get Detail Senior Mentor!", seniorMentor));
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const user = req.user;

      const seniorMentorRequest = {
        loggedRole: user.role,
        username: req?.body?.username,
        password: req?.body?.password,
        role: "SENIOR_MENTOR",
        name: req?.body?.name,
        email: req?.body?.email,
        phoneNumber: req?.body?.phoneNumber,
        profilePicture: req?.body?.profilePicture,
      };

      const seniorMentor = await SeniorMentorService.create(seniorMentorRequest);

      res.status(API_STATUS_CODE.CREATED).json(ResponseHelper.toJson("Success creared senior mentor", seniorMentor));
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const user = req.user;

      const seniorMentorRequest = {
        loggedRole: user.role,
        seniorMentorId: req?.params?.seniorMentorId ? Number(req?.params?.seniorMentorId) : null,
        username: req?.body?.username,
        name: req?.body?.name,
        email: req?.body?.email,
        phoneNumber: req?.body?.phoneNumber,
        profilePicture: req?.body?.profilePicture,
      };

      const seniorMentor = await SeniorMentorService.update(seniorMentorRequest);

      res.status(API_STATUS_CODE.CREATED).json(ResponseHelper.toJson("Success update senior mentor ", seniorMentor));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const user = req.user;

      const seniorMentorRequest = {
        loggedRole: user.role,
        seniorMentorId: req?.params?.seniorMentorId ? Number(req?.params?.seniorMentorId) : null,
      };

      await SeniorMentorService.delete(seniorMentorRequest);

      return res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Success Delete Senior Mentor!"));
    } catch (error) {
      next(error);
    }
  }
}
