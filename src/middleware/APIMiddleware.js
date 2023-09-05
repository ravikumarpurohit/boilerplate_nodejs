"use strict";

const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { logger } = require("../utils/logger");
const { error } = require("../models/responsesModels/responseModel");
const { statusCodeEnum } = require("../utils/commonFun");

const APIMiddleware = (req, res, next) => {
  //  if access token given
  if (req.cookies.access_token || req.cookies["access_token"] || req.headers.access_token || req.headers["access_token"]) {
    const token = req.cookies["access_token"] || req.headers["access_token"] || req.cookies.access_token || req.headers.access_token;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return error("Please login again.", statusCodeEnum.badRequest, res, err);
      } else if (decoded) {
        req.user = decoded;
        next();
      } else {
        return error("Please login again.", statusCodeEnum.badRequest, res, {});
      }
    });
  } else {
    return error("Please login again.", statusCodeEnum.badRequest, res, {});
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.headers.admin_token || req.headers["admin_token"] || req.cookies.admin_token || req.cookies["admin_token"]) {
    const token = req.headers.admin_token || req.headers["admin_token"] || req.cookies.admin_token || req.cookies["adminanjaleestoken"];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return error("Please login again.", statusCodeEnum.badRequest, res, err);
      } else if (decoded) {
        console.log(decoded);
        req.user = decoded;
        if (req.user.role != "admin") {
          return error("Please login Admin token.", statusCodeEnum.badRequest, res, {});
        }
        next();
      } else {
        return error("Please login again.", statusCodeEnum.badRequest, res, {});
      }
    });
  } else {
    return error("Please login again.", statusCodeEnum.badRequest, res, {});
  }
};

const UserMiddleware = (req, res, next) => {
  if (req.cookies.access_token || req.cookies["access_token"] || req.headers.access_token || req.headers["access_token"]) {
    const token = req.cookies["access_token"] || req.headers["access_token"] || req.cookies.access_token || req.headers.access_token;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return error("Please login again.", statusCodeEnum.badRequest, res, err);
      } else if (decoded) {
        req.user = decoded;
        next();
      } else {
        return error("Please login again.", statusCodeEnum.badRequest, res, {});
      }
    });
  } else {
    return error("Please login again.", statusCodeEnum.badRequest, res, {});
  }
};

const validateRequestMiddlware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error("Invalid Request.", statusCodeEnum.badRequest, res, errors.array());
  }
  next();
};

module.exports = {
  APIMiddleware,
  adminMiddleware,
  UserMiddleware,
  validateRequestMiddlware,
};