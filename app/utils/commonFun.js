var multer = require("multer");
const path = require("path");
const { logger } = require("./logger");
const ObjectId = require("mongoose").Types.ObjectId;

const statusCodeEnum = {
  success: 200,
  created: 201,
  accepted: 202,
  badRequest: 400,
  unauthorized: 401,
  paymentRequired: 402,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  requestTimeout: 408,
  conflict: 409,
  payLoadTooLarge: 411,
  unsupportedMediaType: 415,
  unprocesssbleEntity: 422,
  internalServerError: 500,
  serviceUnavilable: 503,
};
const OPEN_ORDER = "OpenOrder";
const AUTORIZED_ORDER = "AutorizedOrder";

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../../upload/productImages/"));
  },
  filename: function (req, file, callback) {
    callback(null, getFileName(file));
  },
});

const uploadImages = multer({ storage: storage }).array("images", 10);

const getFileName = (file) => {
  let newFileName = "";
  if (file) {
    let uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    newFileName = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
    file.filename = newFileName;
  }
  return newFileName;
};

const deleteFile = (fileName) => {
  let filePath = path.join(__dirname, `../../upload/productImages/${fileName}`);
  unlink(filePath);
};

function GenerateInvoideId(orderCount = 0) {
  let today = new Date();
  let date = today.getDate() > 10 ? today.getDate() : "0" + today.getDate();
  let month = today.getMonth() + 1 > 10 ? today.getMonth() + 1 : "0" + (today.getMonth() + 1);
  let year = today.getFullYear();
  return `${month}${date}${year}${orderCount}`;
}

module.exports = {
  statusCodeEnum,
  uploadImages,
  deleteFile,
  getFileName,
  storage,
  GenerateInvoideId,
  OPEN_ORDER,
  AUTORIZED_ORDER,
};
