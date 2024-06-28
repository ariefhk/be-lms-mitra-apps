import multer from "multer";
import path from "path";
import { ResponseHelper } from "../helper/response-json.helper.js";
import { API_STATUS_CODE } from "../helper/status-code.helper.js";
import { APIError } from "../error/api.error.js";

const FILE_LIMIT = 2 * 1024 * 1024;

export const fileUploader = multer({
  limits: {
    fileSize: FILE_LIMIT,
  },
  fileFilter: function (req, file, cb) {
    let extFile = path.extname(file.originalname);
    if (extFile === ".png" || extFile === ".jpg" || extFile === ".jpeg") return cb(null, true);

    // A Multer error occurred when uploading.
    cb(null, false);
    cb(new APIError(400, "Filetype must be PNG/JPG/JPEG"));
  },
  storage: multer.diskStorage({}),
  // storage: multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, path.join(path.resolve(""), "public/images"));
  //   },
  //   filename: function (req, file, cb) {
  //     let extFile = path.extname(file.originalname);
  //     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  //     cb(null, file.fieldname + "-" + uniqueSuffix + extFile);
  //   },
  // }),
});

// export const imageUploader = (req, res, next) => {
//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred when uploading.
//       return res.status(API_STATUS_CODE.BAD_REQUEST).json(ResponseHelper.toJsonError(err.message)).end();
//     } else if (err) {
//       console.log(err);
//       // An unknown error occurred when uploading.
//       return res.status(API_STATUS_CODE.BAD_REQUEST).json(ResponseHelper.toJsonError("Error while uploading file!")).end();
//     }
//     next();
//   });
// };
