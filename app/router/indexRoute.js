const api = require("express").Router();
const openRoute = require("./openRoute");
const adminRoute = require("./adminRoute");

api.use("/", openRoute);
api.use("/admin", adminRoute);

module.exports = api;
