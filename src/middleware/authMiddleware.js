"use strict";
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { logger } = require("../utils/logger");
const { StatusCodes } = require("http-status-codes");
const { error } = require("../models/responsesModels/responseModel");
const { JWTSecret } = require("../config/index");
const { Role } = require("../models/userModel");

const apiMiddleware = (req, res, next) => {
  //  if access token given
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    jwt.verify(token, JWTSecret, (err, decoded) => {
      if (err) {
        return error("Please login again.", StatusCodes.BAD_REQUEST, res, err);
      } else if (decoded) {
        req.user = decoded;
        req.token = token;

        next();
      } else {
        return error("Please login again.", StatusCodes.BAD_REQUEST, res, {});
      }
    });
  } else {
    return error("Please login again.", StatusCodes.BAD_REQUEST, res, {});
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    jwt.verify(token, JWTSecret, (err, decoded) => {
      if (err) {
        return error("Please login again.", StatusCodes.BAD_REQUEST, res, err);
      } else if (decoded) {

        req.user = decoded;

        if (req.user.role != Role.ADMIN) {
          return error("Please login Admin token.", StatusCodes.BAD_REQUEST, res, {});
        }
        next();
      } else {
        return error("Please login again.", StatusCodes.BAD_REQUEST, res, {});
      }
    });
  } else {
    return error("Please login again.", StatusCodes.BAD_REQUEST, res, {});
  }
};

const userMiddleware = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    jwt.verify(token, JWTSecret, (err, decoded) => {
      if (err) {
        return error("Please login again.", StatusCodes.BAD_REQUEST, res, err);
      } else if (decoded) {
        req.user = decoded;
        // Check if the user is an admin
        if (req.user.role === Role.ADMIN) {
          // Allow the request to proceed for admin users
          next();
        } else if (req.user._id != req.params._id) {
          // If the user is not an admin, check if _id matches
          return error("Please login User token.", StatusCodes.BAD_REQUEST, res, {});
        } else {
          // If the user is not an admin and _id matches, allow the request to proceed
          next();
        }
      } else {
        return error("Please login again.", StatusCodes.BAD_REQUEST, res, {});
      }
    });
  } else {
    return error("Please login again.", StatusCodes.BAD_REQUEST, res, {});
  }
};

const validateRequestMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error("Invalid Request.", StatusCodes.BAD_REQUEST, res, errors.array());
  }
  next();
};

module.exports = {
  apiMiddleware,
  adminMiddleware,
  userMiddleware,
  validateRequestMiddleware
};
