import { db } from "../db/connector.db.js";
import { APIError } from "../error/api.error.js";
import { checkAllowedRole, ROLE } from "../helper/allowed-role.helper.js";
import { createBcryptPassword } from "../helper/bcrypt.helper.js";
import { API_STATUS_CODE } from "../helper/status-code.helper.js";

export class AdminService {
  static async list(request) {
    checkAllowedRole(ROLE.IS_ADMIN, request.role);

    const admins = await db.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        createdAt: true,
      },
    });

    return admins;
  }

  static async detail(request) {
    checkAllowedRole(ROLE.IS_ADMIN, request.role);

    if (!request?.adminId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Admin Id must be inputted!");
    }

    const existedAdmin = await db.admin.findUnique({
      where: {
        id: request.adminId,
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

    if (!existedAdmin) {
      throw new APIError(API_STATUS_CODE.NOT_FOUND, "admin not found!");
    }

    const formatedDetailAdmin = {
      id: existedAdmin.id,
      username: existedAdmin.user.username,
      name: existedAdmin.name,
      email: existedAdmin.email,
      phoneNumber: existedAdmin.phoneNumber,
      profilePicture: existedAdmin.profilePicture,
      createdAt: existedAdmin.createdAt,
    };

    return formatedDetailAdmin;
  }

  static async create(request) {
    checkAllowedRole(ROLE.IS_ADMIN, request.role);

    const countUser = await db.user.count({
      where: {
        username: request.username,
      },
    });

    if (countUser !== 0) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "user already exist!");
    }

    request.password = await createBcryptPassword(request.password);

    const createdUser = await db.user.create({
      data: {
        username: request.username,
        password: request.password,
        role: request.role,
      },
    });

    const createdAdmin = await db.admin.create({
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

    return createdAdmin;
  }

  static async update(request) {
    checkAllowedRole(ROLE.IS_ADMIN, request.role);

    if (!request?.adminId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Admin Id must be inputted!");
    }

    const existedAdmin = await db.admin.findUnique({
      where: {
        id: request.adminId,
      },
    });

    if (!existedAdmin) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Admin not found!");
    }

    const updatedAdmin = await db.admin.update({
      where: {
        id: existedAdmin.id,
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

    return updatedAdmin;
  }

  static async delete(request) {
    checkAllowedRole(ROLE.IS_ADMIN, request.role);

    if (!request?.adminId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Admin Id must be inputted!");
    }

    const existedAdmin = await db.admin.findUnique({
      where: {
        id: request?.adminId,
      },
    });

    if (!existedAdmin) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Admin not found!");
    }

    const deletedAdmin = await db.admin.delete({
      where: {
        id: existedAdmin.id,
      },
    });

    await db.user.delete({
      where: {
        id: deletedAdmin.userId,
      },
    });

    return true;
  }
}
