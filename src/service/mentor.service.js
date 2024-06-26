import { APIError } from "../error/api.error.js";
import { API_STATUS_CODE } from "../helper/status-code.helper.js";
import { createBcryptPassword } from "../helper/bcrypt.helper.js";
import { checkAllowedRole, ROLE } from "../helper/allowed-role.helper.js";
import { db } from "../db/connector.db.js";

export class MentorService {
  static async list(request) {
    checkAllowedRole(ROLE.IS_ADMIN_MENTOR, request.loggedRole);
    let filter = {};

    if (request?.name) {
      filter.name = {
        contains: request?.name,
        mode: "insensitive",
      };
    }

    const mentors = await db.mentor.findMany({
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
        seniorMentor: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
    });

    return mentors;
  }

  static async getMentorBySeniorMentor(request) {
    checkAllowedRole(ROLE.IS_ADMIN_SENIOR_MENTOR, request.loggedRole);
    const filter = [];

    console.log("request senior mentor: ", request);

    if (!request?.seniorMentorId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Senior Mentor Id must be inputted!");
    }

    const existedSeniorMentor = await db.seniorMentor.findFirst({
      where: {
        userId: request.seniorMentorId,
      },
    });

    if (!existedSeniorMentor) {
      throw new APIError(API_STATUS_CODE.NOT_FOUND, "Senior Mentor not found!");
    }

    filter.push({
      seniorMentorId: existedSeniorMentor.id,
    });

    if (request?.name) {
      filter.push({
        name: {
          contains: request?.name,
          mode: "insensitive",
        },
      });
    }

    const existedMentors = await db.mentor.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      where: {
        AND: filter,
      },
      select: {
        id: true,
        user: {
          select: {
            username: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        createdAt: true,
      },
    });

    const formatedGetMentorBySeniorMentor =
      existedMentors.length > 0
        ? existedMentors.map((mentor) => {
            return {
              id: mentor.id,
              username: mentor.user.username,
              name: mentor.name,
              email: mentor.email,
              phoneNumber: mentor.phoneNumber,
              profilePicture: mentor.profilePicture,
              class: {
                id: mentor?.class?.id || null,
                name: mentor?.class?.name || null,
              },
              createdAt: mentor.createdAt,
            };
          })
        : [];

    return formatedGetMentorBySeniorMentor;
  }

  static async detail(request) {
    checkAllowedRole(ROLE.IS_ALL_ROLE, request.loggedRole);

    if (!request?.mentorId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Mentor Id must be inputted!");
    }

    const existedMentor = await db.mentor.findUnique({
      where: {
        id: request.mentorId,
      },
      select: {
        id: true,
        user: {
          select: {
            username: true,
          },
        },
        seniorMentorId: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        createdAt: true,
      },
    });

    if (!existedMentor) {
      throw new APIError(API_STATUS_CODE.NOT_FOUND, "Mentor not found!");
    }

    const formatedDetailMentor = {
      id: existedMentor.id,
      username: existedMentor.user.username,
      seniorMentorId: existedMentor.seniorMentorId,
      name: existedMentor.name,
      email: existedMentor.email,
      phoneNumber: existedMentor.phoneNumber,
      profilePicture: existedMentor.profilePicture,
      createdAt: existedMentor.createdAt,
    };

    return formatedDetailMentor;
  }

  static async create(request) {
    checkAllowedRole(ROLE.IS_ADMIN_SENIOR_MENTOR, request.loggedRole);

    if (!request?.seniorMentorId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Senior Mentor Id must be inputted!");
    }

    const countUser = await db.user.count({
      where: {
        username: request.username,
      },
    });

    if (countUser !== 0) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Mentor already exist!");
    }

    request.password = await createBcryptPassword(request.password);

    const createdUser = await db.user.create({
      data: {
        username: request.username,
        password: request.password,
        role: "MENTOR",
      },
    });

    const createdMentor = await db.mentor.create({
      data: {
        name: request.name,
        email: request.email,
        phoneNumber: request.phoneNumber,
        profilePicture: request.profilePicture,
        userId: createdUser.id,
        seniorMentorId: request.seniorMentorId,
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

    return createdMentor;
  }

  static async update(request) {
    checkAllowedRole(ROLE.IS_ALL_ROLE, request.loggedRole);

    let updatedMentorData = {
      name: request.name,
      email: request.email,
      phoneNumber: request.phoneNumber,
      profilePicture: request.profilePicture,
    };

    if (!request?.mentorId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Senior Mentor Id must be inputted!");
    }

    if (request?.seniorMentorId) {
      updatedMentorData.seniorMentorId = request.seniorMentorId;
    }

    const existedMentor = await db.mentor.findUnique({
      where: {
        id: request.mentorId,
      },
    });

    if (!existedMentor) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Mentor not found!");
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
          id: existedMentor.userId,
        },
        data: {
          username: request.username,
        },
      });
    }

    const updatedMentor = await db.mentor.update({
      where: {
        id: existedMentor.id,
      },
      data: updatedMentorData,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        createdAt: true,
      },
    });

    return updatedMentor;
  }
  static async delete(request) {
    checkAllowedRole(ROLE.IS_ADMIN_SENIOR_MENTOR, request.loggedRole);

    if (!request?.mentorId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Mentor Id must be inputted!");
    }

    const existedMentor = await db.mentor.findUnique({
      where: {
        id: request?.mentorId,
      },
    });

    if (!existedMentor) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Mentor not found!");
    }

    const deletedMentor = await db.mentor.delete({
      where: {
        id: existedMentor.id,
      },
    });

    await db.user.delete({
      where: {
        id: deletedMentor.userId,
      },
    });

    return true;
  }
}
