import { getBaseUrl, getFile, getFileNew, saveFile } from "../helper/file.helper.js";
import { ResponseHelper } from "../helper/response-json.helper.js";
import { API_STATUS_CODE } from "../helper/status-code.helper.js";
import path from "path";
import { BASE_FILE, BASE_STORAGE_FILE, FILE_ASSIGNMENT, IMG_PROFILE } from "../constant/file-directory.constant.js";

export class HelloController {
  static async sayHello(req, res, next) {
    try {
      const baseUrl = getBaseUrl(req);
      const file = req.file;
      const imageUrl = await saveFile(file, "assign", BASE_STORAGE_FILE, FILE_ASSIGNMENT);
      const fileUrl = `${baseUrl}/${imageUrl}`;

      res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Hello from API!", fileUrl));
    } catch (error) {
      next(error);
    }
  }
  static getHello(req, res, next) {
    try {
      const fileurl = req?.query.fileUrl;

      getFileNew(BASE_STORAGE_FILE, fileurl, res);
    } catch (error) {
      console.log("error HMMM", error);
      next(error);
    }
  }
  static downloadFile(req, res, next) {
    try {
      const fileurl = req?.body.fileUrl;
      const getServerFileUrl = getFile(BASE_FILE, fileurl);

      res.status(API_STATUS_CODE.OK).json(ResponseHelper.toJson("Hello from API!", getServerFileUrl));
    } catch (error) {
      next(error);
    }
  }
}
