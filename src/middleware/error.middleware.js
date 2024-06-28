import { APIError } from "../error/api.error.js";
import { ResponseHelper } from "../helper/response-json.helper.js";
import { API_STATUS_CODE } from "../helper/status-code.helper.js";
import { logger } from "../application/logging.js";
import { Prisma } from "@prisma/client";
import multer from "multer";

export const errorMiddleware = async (error, req, res, next) => {
  if (error instanceof APIError) {
    logger.error(`ERROR_STATUS: ${error.status}, API_ERROR: ${error.message}`);
    return res.status(error.status).json(ResponseHelper.toJsonError(error.message)).end();
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error(`ERROR_STATUS: 500, PRISMA_CLIENT_KNOWN_ERROR: ${error.message}`);
    return res.status(API_STATUS_CODE.SERVER_ERROR).json(ResponseHelper.toJsonError(error.message)).end();
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    logger.error(`ERROR_STATUS: 500, PRISMA_CLIENT_UNKNOWN_ERROR: ${error.message}`);
    return res.status(API_STATUS_CODE.SERVER_ERROR).json(ResponseHelper.toJsonError(error.message)).end();
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    logger.error(`ERROR_STATUS: 500, PRISMA_INITIALIZATION_ERROR: ${error.message}`);
    return res.status(API_STATUS_CODE.SERVER_ERROR).json(ResponseHelper.toJsonError(error.message)).end();
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    logger.error(`ERROR_STATUS: 500, PRISMA_VALIDATION_ERROR: ${error.message}`);
    return res.status(API_STATUS_CODE.SERVER_ERROR).json(ResponseHelper.toJsonError(error.message)).end();
  } else if (error instanceof multer.MulterError) {
    return res.status(API_STATUS_CODE.BAD_REQUEST).json(ResponseHelper.toJsonError(error.message)).end();
  } else if (error instanceof Error) {
    logger.error(`ERROR_STATUS: 500, SERVER_ERROR: ${error.message}`);
    return res.status(API_STATUS_CODE.SERVER_ERROR).json(ResponseHelper.toJsonError(error.message)).end();
  }
};
