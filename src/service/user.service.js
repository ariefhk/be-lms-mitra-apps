import { compareBcryptPassword, createBcryptPassword } from "../helper/bcrypt.helper.js";
import { createJwt, decodeJwt } from "../helper/jwt.helper.js";
import { APIError } from "../error/api.error.js";
import { API_STATUS_CODE } from "../helper/status-code.helper.js";
import { db } from "../db/connector.db.js";

export class UserService {
  static async register(request) {
    const countUser = await db.user.count({
      where: {
        username: request?.username,
      },
    });

    if (countUser !== 0) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "User already exist!");
    }

    request.password = await createBcryptPassword(request.password);

    const user = await db.user.create({
      data: {
        role: request.role,
        username: request.username,
        password: request.password,
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    if (request.role === "SENIOR_MENTOR") {
      await db.seniorMentor.create({
        data: {
          userId: user.id,
          name: request?.name,
        },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          profilePicture: true,
        },
      });
    } else if (request.role === "MENTOR") {
      await db.mentor.create({
        data: {
          userId: user.id,
          name: request?.name,
        },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          profilePicture: true,
        },
      });
    } else if (request.role === "MENTEE") {
      await db.mentee.create({
        data: {
          userId: user.id,
          name: request?.name,
        },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          profilePicture: true,
        },
      });
    } else if (request.role === "ADMIN") {
      await db.admin.create({
        data: {
          userId: user.id,
          name: request?.name,
        },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          profilePicture: true,
        },
      });
    }

    return user;
  }

  static async login(request) {
    const existedUser = await db.user.findFirst({
      where: {
        username: request.username,
      },
    });

    if (!existedUser) {
      throw new APIError(API_STATUS_CODE.NOT_FOUND, "User not found!");
    }

    let detailUser;

    if (existedUser.role === "SENIOR_MENTOR") {
      detailUser = await db.seniorMentor.findFirst({
        where: {
          userId: existedUser.id,
        },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          profilePicture: true,
        },
      });
    } else if (existedUser.role === "MENTOR") {
      detailUser = await db.mentor.findFirst({
        where: {
          userId: existedUser.id,
        },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          profilePicture: true,
        },
      });
    } else if (existedUser.role === "MENTEE") {
      detailUser = await db.mentee.findFirst({
        where: {
          userId: existedUser.id,
        },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          profilePicture: true,
        },
      });
    } else if (existedUser.role === "ADMIN") {
      detailUser = await db.admin.findFirst({
        where: {
          userId: existedUser.id,
        },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          profilePicture: true,
        },
      });
    }

    const isValidPassword = await compareBcryptPassword(request.password, existedUser.password);

    if (!isValidPassword) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Username or Password wrong!");
    }

    const token = await createJwt(
      {
        id: existedUser.id,
        name: existedUser.name,
        role: existedUser.role,
      },
      "30d"
    );

    const updateUserToken = await db.user.update({
      where: {
        id: existedUser.id,
      },
      data: {
        token,
      },
    });

    return {
      id: existedUser.id,
      name: detailUser?.name,
      email: detailUser?.email,
      phoneNumber: detailUser?.phoneNumber,
      profilePicture: detailUser?.profilePicture,
      username: existedUser.username,
      role: existedUser.role,
      token: updateUserToken.token,
    };
  }

  static async checkUserToken(token) {
    const decodedUser = await decodeJwt(token);

    const existedUser = await db.user.findUnique({
      where: {
        id: decodedUser.id,
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
        role: true,
      },
    });

    if (!existedUser) {
      throw new APIError(API_STATUS_CODE.NOT_FOUND, "User not found!");
    }

    let user;

    if (existedUser.role === "SENIOR_MENTOR") {
      user = await db.seniorMentor.findFirst({
        where: {
          userId: existedUser.id,
        },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          profilePicture: true,
        },
      });
    } else if (existedUser.role === "MENTOR") {
      user = await db.mentor.findFirst({
        where: {
          userId: existedUser.id,
        },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          profilePicture: true,
        },
      });
    } else if (existedUser.role === "MENTEE") {
      user = await db.mentee.findFirst({
        where: {
          userId: existedUser.id,
        },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          profilePicture: true,
        },
      });
    } else if (existedUser.role === "ADMIN") {
      user = await db.admin.findFirst({
        where: {
          userId: existedUser.id,
        },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          profilePicture: true,
        },
      });
    }

    if (!user) {
      throw new APIError(API_STATUS_CODE.NOT_FOUND, "User not specific update each the roles!");
    }

    return {
      id: existedUser.id, // we get id of user for easy delete
      username: existedUser.username,
      role: existedUser.role,
      ...user,
    };
  }
}
