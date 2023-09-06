const api = require("express").Router();
const openRoute = require("./openRoute");
const userRoute = require("./userRoute");

api.use("/", openRoute);
api.use("/user", userRoute);

module.exports = api;
