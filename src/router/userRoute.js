const userRoute = require("express").Router();
const userController = require("../controller/userController");
const { userMiddleware, adminMiddleware, apiMiddleware } = require("../middleware/authMiddleware");
const upload = require("../utils/filesUploads");

userRoute.post("/", adminMiddleware, userController.signUp);

userRoute.post("/login", userController.signIn);

userRoute.post("/checkUser", apiMiddleware, userController.checkUser);

userRoute.post("/signOut", userMiddleware, userController.signOut);

userRoute.delete("/delete/:_id", adminMiddleware, userController.delete);

userRoute.patch("/update/:_id", userMiddleware, userController.update);

userRoute.get("/list", adminMiddleware, userController.get);

userRoute.get("/:_id", userMiddleware, userController.getById);

userRoute.post("/change-password/:_id", userMiddleware, userController.changePassword);

userRoute.get("/email-verify/:_id", userController.emailVerify);

userRoute.post("/profile-image/:_id", userMiddleware, upload.single("profileImage"), userController.profileImage);

userRoute.post("/active-user/:_id", adminMiddleware, userController.activeUser);

userRoute.get("/set-password/:_id", userController.setPassword);

userRoute.post("/set-password/:_id", userController.updatePassword);

module.exports = userRoute;
