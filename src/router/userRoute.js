import express from "express";
import {
  signUp,
  signIn,
  checkUser,
  signOut,
  deleteUser,
  update,
  get,
  getById,
  changePassword,
  emailVerify,
  profileImage,
  activeUser,
  setUserPassword,
  updatePassword,
} from "../controller/userController.js";

import {
  userMiddleware,
  adminMiddleware,
  apiMiddleware,
} from "../middleware/APIMiddleware.js";

import upload from "../utils/filesUploads.js";

const userRoute = express.Router();

userRoute.post("/", adminMiddleware, signUp);

userRoute.post("/login", signIn);

userRoute.post("/checkUser", apiMiddleware, checkUser);

userRoute.post("/signOut", userMiddleware, signOut);

userRoute.delete("/delete/:_id", adminMiddleware, deleteUser);

userRoute.patch("/update/:_id", userMiddleware, update);

userRoute.get("/list", adminMiddleware, get);

userRoute.get("/:_id", userMiddleware, getById);

userRoute.post("/change-password/:_id", userMiddleware, changePassword);

userRoute.get("/email-verify/:_id", emailVerify);

userRoute.post(
  "/profile-image/:_id",
  userMiddleware,
  upload.single("profileImage"),
  profileImage
);

userRoute.post("/active-user/:_id", adminMiddleware, activeUser);

userRoute.get("/set-password/:_id", setUserPassword);

userRoute.post("/set-password/:_id", updatePassword);

export default userRoute;
