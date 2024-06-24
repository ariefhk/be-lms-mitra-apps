import { APIError } from "../error/api.error.js";
import { API_STATUS_CODE } from "../helper/status-code.helper.js";
import { checkAllowedRole, ROLE } from "../helper/allowed-role.helper.js";
import { db } from "../db/connector.db.js";
import { createBcryptPassword } from "../helper/bcrypt.helper.js";

export class SeniorMentorService {
  static async list(request) {
    checkAllowedRole(ROLE.IS_ADMIN_SENIOR_MENTOR, request.loggedRole);
    let filter = {};

    if (request?.name) {
      filter.name = {
        contains: request?.name,
        mode: "insensitive",
      };
    }

    const seniorMentor = await db.seniorMentor.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      where: filter,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        createdAt: true,
      },
    });

    return seniorMentor;
  }
  static async detail(request) {
    checkAllowedRole(ROLE.IS_ADMIN_SENIOR_MENTOR, request.loggedRole);

    if (!request?.seniorMentorId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Senior Mentor Id must be inputted!");
    }

    const existedSeniorMentor = await db.seniorMentor.findUnique({
      where: {
        id: request.seniorMentorId,
      },
      select: {
        id: true,
        user: {
          select: {
            username: true,
          },
        },
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        createdAt: true,
      },
    });

    if (!existedSeniorMentor) {
      throw new APIError(API_STATUS_CODE.NOT_FOUND, "seniorMentor not found!");
    }

    const formatedDetailAdmin = {
      id: existedSeniorMentor.id,
      username: existedSeniorMentor.user.username,
      name: existedSeniorMentor.name,
      email: existedSeniorMentor.email,
      phoneNumber: existedSeniorMentor.phoneNumber,
      profilePicture: existedSeniorMentor.profilePicture,
      createdAt: existedSeniorMentor.createdAt,
    };

    return formatedDetailAdmin;
  }
  static async create(request) {
    checkAllowedRole(ROLE.IS_ADMIN_SENIOR_MENTOR, request.loggedRole);

    const countUser = await db.user.count({
      where: {
        username: request.username,
      },
    });

    if (countUser !== 0) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "senior mentor already exist!");
    }

    request.password = await createBcryptPassword(request.password);

    const createdUser = await db.user.create({
      data: {
        username: request.username,
        password: request.password,
        role: "SENIOR_MENTOR",
      },
    });

    const createdSeniorMentor = await db.seniorMentor.create({
      data: {
        name: request.name,
        email: request.email,
        phoneNumber: request.phoneNumber,
        profilePicture: request.profilePicture,
        userId: createdUser.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        createdAt: true,
      },
    });

    return createdSeniorMentor;
  }
  static async update(request) {
    checkAllowedRole(ROLE.IS_ADMIN_SENIOR_MENTOR, request.loggedRole);

    if (!request?.seniorMentorId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Senior Mentor Id must be inputted!");
    }

    const existedSeniorMentor = await db.seniorMentor.findUnique({
      where: {
        id: request.seniorMentorId,
      },
    });

    if (!existedSeniorMentor) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Senior Mentor not found!");
    }

    if (request?.username) {
      const existedUserWithSameUsername = await db.user.findFirst({
        where: {
          username: request.username,
        },
        select: {
          id: true,
        },
      });

      if (existedUserWithSameUsername) {
        throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Username already exist!");
      }

      await db.user.update({
        where: {
          id: existedSeniorMentor.userId,
        },
        data: {
          username: request.username,
        },
      });
    }

    const updatedSeniorMentor = await db.seniorMentor.update({
      where: {
        id: existedSeniorMentor.id,
      },
      data: {
        name: request.name,
        email: request.email,
        phoneNumber: request.phoneNumber,
        profilePicture: request.profilePicture,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        createdAt: true,
      },
    });

    return updatedSeniorMentor;
  }
  static async delete(request) {
    checkAllowedRole(ROLE.IS_ADMIN_SENIOR_MENTOR, request.loggedRole);

    if (!request?.seniorMentorId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Senior Mentor Id must be inputted!");
    }

    const existedSeniorMentor = await db.seniorMentor.findUnique({
      where: {
        id: request?.seniorMentorId,
      },
    });

    if (!existedSeniorMentor) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Senior Mentor not found!");
    }

    const deletedSeniorMentor = await db.seniorMentor.delete({
      where: {
        id: existedSeniorMentor.id,
      },
    });

    await db.user.delete({
      where: {
        id: deletedSeniorMentor.userId,
      },
    });

    return true;
  }
}
