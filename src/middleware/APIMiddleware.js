"use strict";

const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { logger } = require("../utils/logger");
const { error } = require("../models/responsesModels/responseModel");
const { StatusCodes } = require("http-status-codes");
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
        // console.log(req.user._id , req.user._id);
        //         if (req.user._id != req.user._id) {
        //           return error("Please login User token.", StatusCodes.BAD_REQUEST, res, {});
        //         }
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
        console.log(decoded);
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
        console.log(req.user._id, req.params._id);
        if (req.user._id != req.params._id) {
          return error("Please login User token===.", StatusCodes.BAD_REQUEST, res, {});
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

const validateRequestMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error("Invalid Request.", StatusCodes.BAD_REQUEST, res, errors.array());
  }
  next();
}; //const searchData = await proprietyModel.findById(req.params._id);

module.exports = {
  apiMiddleware,
  adminMiddleware,
  userMiddleware,
  validateRequestMiddleware,
};
