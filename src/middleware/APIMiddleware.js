import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { logger } from "../utils/logger.js";
import { error } from "../models/responsesModels/responseModel.js";
import { StatusCodes } from "http-status-codes";
import { JWTSecret } from "../config/index.js";
import { Role } from "../models/userModel.js";

const apiMiddleware = (req, res, next) => {
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

        if (req.user.role !== Role.ADMIN) {
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

        if (req.user._id !== req.params._id) {
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
};

export {
  apiMiddleware,
  adminMiddleware,
  userMiddleware,
  validateRequestMiddleware
};
