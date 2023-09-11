const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  port: process.env.PORT,
  environment: process.env.NODE_ENV,
  databaseURL: process.env.DATABASE_URI,
  clientDomain: process.env.CLIENT_APPLICATION_DOMAIN,
  JWTSecret: process.env.JWT_SECRET,
};
