import { ResponseHelper } from "../helper/response-json.helper.js";
import { API_STATUS_CODE } from "../helper/status-code.helper.js";
import { MentorService } from "../service/mentor.service.js";

export class MentorController {
  static async list(req, res, next) {
    try {
      const user = req.user;

      const mentorRequest = {
        loggedRole: user.role,
        name: req?.query?.name,
      };

      const mentors = await MentorService.list(mentorRequest);

      res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Success Get All Mentor", mentors));
    } catch (error) {
      next(error);
    }
  }

  static async getMentorBySeniorMentor(req, res, next) {
    try {
      const user = req.user;

      const mentorRequest = {
        loggedRole: user.role,
        seniorMentorId: req?.params?.seniorMentorId ? Number(req?.params?.seniorMentorId) : null,
        name: req?.query?.name,
      };

      const mentors = await MentorService.getMentorBySeniorMentor(mentorRequest);

      res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Success Get Mentors by Senio Mentor", mentors));
    } catch (error) {
      next(error);
    }
  }
  static async detail(req, res, next) {
    try {
      const user = req.user;

      const mentorRequest = {
        loggedRole: user.role,
        mentorId: req?.params?.mentorId ? Number(req?.params?.mentorId) : null,
      };

      const mentor = await MentorService.detail(mentorRequest);

      res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Success Get Detail Mentor", mentor));
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const user = req.user;

      const mentorRequest = {
        loggedRole: user.role,
        seniorMentorId: req?.body?.seniorMentorId ? Number(req?.body?.seniorMentorId) : null,
        username: req?.body?.username,
        password: req?.body?.password,
        role: "MENTOR",
        name: req?.body?.name,
        email: req?.body?.email,
        phoneNumber: req?.body?.phoneNumber,
        profilePicture: req?.body?.profilePicture,
      };

      const mentor = await MentorService.create(mentorRequest);

      res.status(API_STATUS_CODE.CREATED).json(ResponseHelper.toJson("Success Create Mentor", mentor));
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const user = req.user;

      const mentorRequest = {
        loggedRole: user.role,
        mentorId: req?.params?.mentorId ? Number(req?.params?.mentorId) : null,
        seniorMentorId: req?.body?.seniorMentorId ? Number(req?.body?.seniorMentorId) : null,
        username: req?.body?.username,
        name: req?.body?.name,
        email: req?.body?.email,
        phoneNumber: req?.body?.phoneNumber,
        profilePicture: req?.body?.profilePicture,
      };

      const mentor = await MentorService.update(mentorRequest);

      res.status(API_STATUS_CODE.CREATED).json(ResponseHelper.toJson("Success Update Mentor", mentor));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const user = req.user;

      const mentorRequest = {
        loggedRole: user.role,
        mentorId: req?.params?.mentorId ? Number(req?.params?.mentorId) : null,
      };

      const mentor = await MentorService.delete(mentorRequest);

      res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Success Delete Mentor!", mentor));
    } catch (error) {
      next(error);
    }
  }
}
