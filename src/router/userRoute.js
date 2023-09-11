const userRoute = require("express").Router();
const userController = require("../controller/userController");
const { adminMiddleware } = require("../middleware/APIMiddleware");
const { UserMiddleware } = require("../middleware/APIMiddleware");
const upload = require("../utils/filesUploads");

userRoute.post("/", adminMiddleware, userController.signUp);

userRoute.post("/signIn", userController.signIn);

userRoute.post("/signOut", UserMiddleware, userController.signOut);

userRoute.delete("/delete/:_id", adminMiddleware, userController.delete);

userRoute.patch("/update/:_id", UserMiddleware, userController.update);

userRoute.get("/get/:_id", UserMiddleware, userController.getById);

userRoute.get("/get-list", adminMiddleware, userController.get);

userRoute.post("/change-password/:_id", UserMiddleware, userController.changePassword);

userRoute.get("/email-verify/:_id", userController.emailVerify);

userRoute.post("/profile-image/:_id", UserMiddleware, upload.single("profileImage"), userController.profileImage);

module.exports = userRoute;

