const adminRoute = require("express").Router();
const adminController = require("../controller/adminController");
const { userMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const upload = require("../utils/filesUploads");
const adminImage = upload('uploads/users');
const express = require("express");
const path = require("path");

adminRoute.use("/image", express.static(path.join(__dirname, "../../uploads/admin/")));

adminRoute.post("/", adminController.signUp);

adminRoute.post("/login", adminController.signIn);

adminRoute.get("/checkUser", userMiddleware, adminController.checkUser);

adminRoute.post("/signOut", userMiddleware, adminController.signOut);

adminRoute.delete("/:_id", adminMiddleware, adminController.delete);

adminRoute.patch("/:_id", userMiddleware, adminController.update);

adminRoute.get("/list", adminMiddleware, adminController.get);

adminRoute.get("/:_id", userMiddleware, adminController.getById);

adminRoute.post("/change-password/:_id", userMiddleware, adminController.changePassword);

adminRoute.get("/email-verify/:_id", adminController.emailVerify);

adminRoute.post("/profile-image/:_id", userMiddleware, adminImage.single("profileImage"), adminController.profileImage);

module.exports = adminRoute;