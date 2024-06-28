import fs from "fs";
import path from "path";

export const getBaseUrl = (request) => {
  const host = request.get("host");
  const protocol = request.protocol;
  const baseUrl = `${protocol}://${host}`;
  return baseUrl;
};

export const saveFile = (file, fileName, BASE_DIR, DIR) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("File not found!"));
    }
    if (!fs.existsSync(DIR)) {
      fs.mkdirSync(DIR);
    }
    const extFile = path.extname(file.originalname);
    if (!fileName) {
      return reject(new Error("File name is required"));
    }
    const modifyfileName = `${fileName}-${Date.now()}${extFile}`;
    const filePath = path.posix.join(DIR, modifyfileName);
    const folderFile = `${path.posix.relative(BASE_DIR, filePath)}`;

    fs.rename(file.path, filePath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(folderFile);
    });
  });
};

export const getFile = (DIR, fileUrlPath) => {
  const filePath = path.posix.join(DIR, fileUrlPath);

  console.log("filePath", filePath);

  if (fs.existsSync(filePath)) {
    return `${path.posix.relative(DIR, filePath)}`;
  } else {
    return null;
  }
};

export const getFileNew = (DIR, fileUrlPath, res) => {
  const filePath = path.posix.join(DIR, fileUrlPath);

  if (fs.existsSync(filePath)) {
    // Set headers for file download
    res.setHeader("Content-Disposition", `attachment; filename="${path.basename(fileUrlPath)}"`);
    res.setHeader("Content-Type", "application/octet-stream"); // or set the appropriate content type

    // Stream the file directly to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    console.log("File not found:", filePath); // Log the file path not found
    res.status(404).send("File not found");
  }
};

export const deleteFile = (DIR, fileUrlPath) => {
  return new Promise((resolve, reject) => {
    const existedFile = getFile(DIR, fileUrlPath);

    if (!existedFile) {
      return reject(new Error("File Not FOund!"));
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

export const updateFile = async (oldFileName, newFile) => {
  await deleteFile(oldFileName);
  return saveFile(newFile);
};
