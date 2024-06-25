import { APIError } from "../error/api.error.js";
import { API_STATUS_CODE } from "../helper/status-code.helper.js";
import { db } from "../db/connector.db.js";
import { checkAllowedRole, ROLE } from "../helper/allowed-role.helper.js";
import { createBcryptPassword } from "../helper/bcrypt.helper.js";

export class MenteeService {
  static async list(request) {
    checkAllowedRole(ROLE.IS_ADMIN_MENTOR, request.loggedRole);
    let filter = {};

    if (request?.name) {
      filter.name = {
        contains: request?.name,
        mode: "insensitive",
      };
    }

    const mentees = await db.mentee.findMany({
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
        university: true,
        major: true,
        batch: true,
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
    });

    return mentees;
  }

  static async detail(request) {
    checkAllowedRole(ROLE.IS_ALL_ROLE, request.loggedRole);

    if (!request?.menteeId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Mentee Id must be inputted!");
    }

    const existedMentee = await db.mentee.findUnique({
      where: {
        id: request.menteeId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        university: true,
        major: true,
        batch: true,
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
    });

    if (!existedMentee) {
      throw new APIError(API_STATUS_CODE.NOT_FOUND, "Mentee not found!");
    }

    return existedMentee;
  }

  static async create(request) {
    checkAllowedRole(ROLE.IS_ADMIN_MENTOR, request.loggedRole);

    if (!request?.classId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Class Id must be inputted!");
    }

    const existedClass = await db.class.findUnique({
      where: {
        id: request.classId,
      },
      select: {
        id: true,
        mentor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!existedClass) {
      throw new APIError(API_STATUS_CODE.NOT_FOUND, "Class not found!");
    }

    const countUser = await db.user.count({
      where: {
        username: request.username,
      },
    });

    if (countUser !== 0) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "User already exist!");
    }

    request.password = await createBcryptPassword(request.password);

    const createdUser = await db.user.create({
      data: {
        username: request.username,
        password: request.password,
        role: "MENTEE",
      },
    });

    const createdMentee = await db.mentee.create({
      data: {
        name: request.name,
        email: request.email,
        phoneNumber: request.phoneNumber,
        profilePicture: request.profilePicture,
        university: request.university,
        major: request.major,
        batch: request.batch,
        userId: createdUser.id,
        classId: existedClass.id,
      },
      select: {
        class: {
          select: {
            id: true,
            name: true,
            mentor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedMentee = {
      id: createdMentee.id,
      name: createdMentee.name,
      email: createdMentee.email,
      phoneNumber: createdMentee.phoneNumber,
      profilePicture: createdMentee.profilePicture,
      university: createdMentee.university,
      major: createdMentee.major,
      batch: createdMentee.batch,
      mentor: {
        id: createdMentee?.class?.mentor?.id || null,
        name: createdMentee?.class?.mentor?.name || null,
      },
      class: {
        id: createdMentee?.class?.id || null,
        name: createdMentee?.class?.name || null,
      },
      createdAt: createdMentee.createdAt,
    };

    return formattedMentee;
  }

  static async update(request) {
    checkAllowedRole(ROLE.IS_ADMIN_MENTOR, request.loggedRole);

    let updatedMenteeData = {
      name: request.name,
      email: request.email,
      phoneNumber: request.phoneNumber,
      profilePicture: request.profilePicture,
      university: request.university,
      major: request.major,
      batch: request.batch,
    };

    if (!request?.menteeId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Mentee Id must be inputted!");
    }

    const existedMentee = await db.mentee.findUnique({
      where: {
        id: request.menteeId,
      },
    });

    if (!existedMentee) {
      throw new APIError(API_STATUS_CODE.NOT_FOUND, "Mentee not found!");
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
          id: existedMentee.userId,
        },
        data: {
          username: request.username,
        },
      });
    }

    if (request?.classId) {
      const existedClass = await db.class.findUnique({
        where: {
          id: request.classId,
        },
        select: {
          id: true,
          mentor: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!existedClass) {
        throw new APIError(API_STATUS_CODE.NOT_FOUND, "Class not found!");
      }
      updatedMenteeData.classId = existedClass.id;
    }

    const updatedMentee = await db.mentee.update({
      where: {
        id: existedMentee.id,
      },
      data: updatedMenteeData,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        university: true,
        major: true,
        batch: true,
        class: {
          select: {
            id: true,
            name: true,
            mentor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        createdAt: true,
      },
    });

    const formattedMentee = {
      id: updatedMentee.id,
      name: updatedMentee.name,
      email: updatedMentee.email,
      phoneNumber: updatedMentee.phoneNumber,
      profilePicture: updatedMentee.profilePicture,
      university: updatedMentee.university,
      major: updatedMentee.major,
      batch: updatedMentee.batch,
      mentor: {
        id: updatedMentee?.class?.mentor?.id || null,
        name: updatedMentee?.class?.mentor?.name || null,
      },
      class: {
        id: updatedMentee?.class?.id || null,
        name: updatedMentee?.class?.name || null,
      },
      createdAt: updatedMentee.createdAt,
    };

    return formattedMentee;
  }

  static async delete(request) {
    checkAllowedRole(ROLE.IS_ADMIN_MENTOR, request.loggedRole);
    if (!request?.menteeId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Mentee Id must be inputted!");
    }

    const existedMentee = await db.mentee.findUnique({
      where: {
        id: request.menteeId,
      },
    });

    if (!existedMentee) {
      throw new APIError(API_STATUS_CODE.NOT_FOUND, "Mentee not found!");
    }

    const deletedMentee = await db.mentee.delete({
      where: {
        id: existedMentee.id,
      },
    });

    await db.user.delete({
      where: {
        id: deletedMentee.userId,
      },
    });

    return true;
  }
}
