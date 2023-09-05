const dotenv = require("dotenv");
const multer = require("multer");
dotenv.config();

module.exports = {
  port: process.env.PORT,
  environment: process.env.NODE_ENV,
  databaseURL: process.env.DATABASE_URI,
  clientDomain: process.env.CLIENT_APPLICATION_DOMAIN,
  JWTSecret: process.env.JWT_SECRET,
  upload: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads/");
      },
      filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
      },
    })
  })
};
