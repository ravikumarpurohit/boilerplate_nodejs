import multer from "multer";
import path from "path";
import { unlink } from "fs";
import { logger } from "./logger.js";

const __dirname = path.resolve(); // Needed since __dirname isn't available in ES modules by default

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "upload/productImages/"));
  },
  filename: function (req, file, callback) {
    callback(null, getFileName(file));
  },
});

const uploadImages = multer({ storage }).array("images", 10);

const getFileName = (file) => {
  let newFileName = "";
  if (file) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    newFileName = `${file.fieldname}-${uniqueSuffix}${path.extname(
      file.originalname
    )}`;
    file.filename = newFileName;
  }
  return newFileName;
};

const deleteFile = (fileName) => {
  const filePath = path.join(__dirname, `upload/productImages/${fileName}`);
  unlink(filePath, (err) => {
    if (err) logger.error("File deletion error", filePath, err);
  });
};

const generateInvoiceId = (orderCount = 0) => {
  const today = new Date();
  const date = today.getDate() >= 10 ? today.getDate() : "0" + today.getDate();
  const month =
    today.getMonth() + 1 >= 10
      ? today.getMonth() + 1
      : "0" + (today.getMonth() + 1);
  const year = today.getFullYear();
  return `${month}${date}${year}${orderCount}`;
};

export { uploadImages, deleteFile, getFileName, storage, generateInvoiceId };
