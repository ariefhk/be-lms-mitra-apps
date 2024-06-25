import { db } from "../db/connector.db.js";
import { APIError } from "../error/api.error.js";
import { checkAllowedRole, ROLE } from "../helper/allowed-role.helper.js";
import { API_STATUS_CODE } from "../helper/status-code.helper.js";

export class ClassService {
  static async list(request) {
    checkAllowedRole(ROLE.IS_ADMIN, request.loggedRole);
    let filter = {};

    if (request?.name) {
      filter.name = {
        contains: request.name,
        mode: "insensitive",
      };
    }

    const classes = await db.class.findMany({
      where: filter,
      select: {
        id: true,
        name: true,
        mentor: {
          select: {
            id: true,
            name: true,
            seniorMentor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedClasses =
      classes.length > 0
        ? classes.map((cls) => {
            return {
              id: cls.id,
              name: cls.name,
              mentor: {
                id: cls?.mentor?.id || null,
                name: cls?.mentor?.name || null,
              },
              seniorMentor: {
                id: cls?.mentor?.seniorMentor?.id || null,
                name: cls?.mentor?.seniorMentor?.name || null,
              },
            };
          })
        : [];

    return formattedClasses;
  }

  static async detail(request) {
    checkAllowedRole(ROLE.IS_ADMIN, request.loggedRole);

    if (!request?.classId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "class Id must be inputted!");
    }

    const existedClass = await db.class.findUnique({
      where: {
        id: request.classId,
      },
      select: {
        id: true,
        name: true,
        mentor: {
          select: {
            id: true,
            name: true,
            seniorMentor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        menteeClass: {
          select: {
            mentee: true,
          },
        },
      },
    });

    if (!existedClass) {
      throw new APIError(API_STATUS_CODE.NOT_FOUND, "class not found!");
    }

    const formatedDetailClass = {
      id: existedClass.id,
      name: existedClass.name,
      mentor: {
        id: existedClass?.mentor?.id || null,
        name: existedClass?.mentor?.name || null,
      },
      seniorMentor: {
        id: existedClass?.mentor?.seniorMentor?.id || null,
        name: existedClass?.mentor?.seniorMentor?.name || null,
      },
      mentees:
        existedClass.menteeClass.length > 0
          ? existedClass.menteeClass.map((cls) => {
              return {
                id: cls?.mentee?.id,
                name: cls?.mentee?.name,
                email: cls?.mentee?.email,
                phoneNumber: cls?.mentee?.phoneNumber,
                university: cls?.mentee?.university,
                major: cls?.mentee?.major,
                batch: cls?.mentee?.batch,
                profilePicture: cls?.mentee?.profilePicture,
              };
            })
          : [],
    };

    return formatedDetailClass;
  }

  static async create(request) {
    checkAllowedRole(ROLE.IS_ADMIN, request.loggedRole);

    if (!request?.name) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "name not found!");
    }

    if (!request?.mentorId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "mentor not found!");
    }

    const existedClass = await db.class.findFirst({
      where: {
        AND: [
          {
            name: request.name,
          },
          {
            mentorId: request.mentorId,
          },
        ],
      },
    });

    if (existedClass) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "class already exist!");
    }

    const createdClass = await db.class.create({
      data: {
        name: request?.name,
        mentorId: request?.mentorId,
      },
      select: {
        id: true,
        name: true,
        mentor: {
          select: {
            id: true,
            name: true,
            seniorMentor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const formatedClass = {
      id: createdClass.id,
      name: createdClass.name,
      mentor: {
        id: createdClass?.mentor?.id || null,
        name: createdClass?.mentor?.name || null,
      },
      seniorMentor: {
        id: createdClass?.mentor?.seniorMentor?.id || null,
        name: createdClass?.mentor?.seniorMentor?.name || null,
      },
    };

    return formatedClass;
  }

  static async update(request) {
    checkAllowedRole(ROLE.IS_ADMIN, request.loggedRole);
    let updatedData = {};

    if (request?.name) {
      updatedData.name = request.name;
    }

    if (request?.mentorId) {
      updatedData.mentorId = request.mentorId;
    }

    if (!request?.classId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "Class Id must be inputted!");
    }

    const existedClass = await db.class.findUnique({
      where: {
        id: request.classId,
      },
      select: {
        id: true,
        name: true,
        mentor: {
          select: {
            id: true,
            name: true,
            seniorMentor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        menteeClass: {
          select: {
            mentee: true,
          },
        },
      },
    });

    if (!existedClass) {
      throw new APIError(API_STATUS_CODE.NOT_FOUND, "class not found!");
    }

    const updatedClass = await db.class.update({
      where: {
        id: existedClass.id,
      },
      data: updatedData,
      select: {
        id: true,
        name: true,
        mentor: {
          select: {
            id: true,
            name: true,
            seniorMentor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const formatedClass = {
      id: updatedClass.id,
      name: updatedClass.name,
      mentor: {
        id: updatedClass?.mentor?.id || null,
        name: updatedClass?.mentor?.name || null,
      },
      seniorMentor: {
        id: updatedClass?.mentor?.seniorMentor?.id || null,
        name: updatedClass?.mentor?.seniorMentor?.name || null,
      },
    };

    return formatedClass;
  }

  static async delete(request) {
    checkAllowedRole(ROLE.IS_ADMIN, request.loggedRole);

    if (!request?.classId) {
      throw new APIError(API_STATUS_CODE.BAD_REQUEST, "class Id must be inputted!");
    }

    const existedClass = await db.class.findUnique({
      where: {
        id: request.classId,
      },
      select: {
        id: true,
        name: true,
        mentor: {
          select: {
            id: true,
            name: true,
            seniorMentor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        menteeClass: {
          select: {
            mentee: true,
          },
        },
      },
    });

    if (!existedClass) {
      throw new APIError(API_STATUS_CODE.NOT_FOUND, "class not found!");
    }

    await db.class.delete({
      where: {
        id: existedClass.id,
      },
    });

    return true;
  }
}
