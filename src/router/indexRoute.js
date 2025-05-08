import { Router } from "express";
import openRoute from "./openRoute.js";
import userRoute from "./userRoute.js";

const api = Router();

api.use("/", openRoute);
api.use("/user", userRoute);

export default api;
