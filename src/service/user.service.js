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
      data: request,
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

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
      token: updateUserToken.token,
    };
  }

  static async checkUserToken(token) {
    const user = await decodeJwt(token);

    const existedUser = await db.user.findUnique({
      where: {
        id: user.id,
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

    return existedUser;
  }
}
