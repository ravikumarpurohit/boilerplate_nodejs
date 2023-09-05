const adminRoute = require("express").Router();
const authController = require("../controller/authController");
const { adminMiddleware } = require("../middleware/APIMiddleware");

adminRoute.post("/auth/signin", authController.signIn);

adminRoute.post("/auth/signout", authController.signOut);

adminRoute.post("/auth/check", authController.check);

adminRoute.post("/auth/signup", authController.signUp);


module.exports = adminRoute;
