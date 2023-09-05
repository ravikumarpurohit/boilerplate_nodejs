const jwt = require("jsonwebtoken");
const ObjectId = require("mongoose").Types.ObjectId;
const { validationResult } = require("express-validator");
const { checkPassword, encryptPassword } = require("../utils/passwordCheck");
const adminModel = require("../models/adminModel");
const { JWTSecret } = require("../config/index");
const { success, successAuth, error, exception } = require("../models/responsesModels/responseModel");
const { statusCodeEnum } = require("../utils/commonFun");
const { logger } = require("../utils/logger");

exports.signIn = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        error: errors.array(),
      });
    }
    const { username, password } = req.body;
    let user = await adminModel
      .findOne(
        {
          email: {
            $regex: new RegExp(`^${username}$`, "i"),
          },
        },
        "_id email name password status role"
      )
      .lean();

    if (!user || Object.keys(user).length == 0) {
      return error("user does not exist.", statusCodeEnum.notFound, res, {});
    }

    const isPassword = await checkPassword(password, user.password);
    if (isPassword) {
      if (user.status != "active") {
        return res.json({
          error: "You are inactive",
        });
      }
      const { password, ..._user } = user;
      const _token = jwt.sign({ _id: _user._id, role: _user.role }, JWTSecret, {
        expiresIn: "4h",
      });
      const cookieOptions =
        process.env.NODE_ENV === "development"
          ? {
            httpOnly: true,
            secure: true,
            sameSite: "None",
          }
          : {
            httpOnly: true,
            secure: true,
            sameSite: "None",
          };
      res.cookie("anjalees12589653112845", _token, cookieOptions);
      let data = {
        user: { id: user._id, name: user.name, email: user.email, status: user.status },
      };
      return successAuth("", _token, data, statusCodeEnum.success, res, 5);
    }
    return error("incorrect password.", statusCodeEnum.unauthorized, res, {});
  } catch (error) {
    console.error(error);
    return exception("", statusCodeEnum.internalServerError, res, error);
  }
};

exports.signOut = (req, res) => {
  try {
    res.clearCookie("adminanjaleestoken");
    let data = {
      loggedOut: 1,
    };
    return success("Succesfuly logout.", data, statusCodeEnum.success, res, 5);
  } catch (error) {
    console.error(error);
    return exception("", statusCodeEnum.internalServerError, res, error);
  }
};

exports.check = (req, res) => {
  try {
    if (req.cookies.adminanjaleestoken || req.headers.adminanjaleestoken) {
      const token = req.cookies["adminanjaleestoken"] || req.headers["adminanjaleestoken"];
      jwt.verify(token, JWTSecret, async (err, decoded) => {
        if (err) {
          return error(err.name + ": Please login again.", statusCodeEnum.unauthorized, res, {});
        } else if (decoded) {
          let _user = null;
          _user = await adminModel
            .findOne(
              {
                _id: ObjectId(decoded._id),
              },
              "_id name email status"
            )
            .catch((err) => {
              return exception("", statusCodeEnum.internalServerError, res, err);
            });

          if (_user) {
            if (!res.headersSent) {
              let data = {
                user: {
                  id: _user._id,
                  name: _user.name,
                  email: _user.email,
                  status: _user.status,
                },
              };
              return successAuth("", token, data, statusCodeEnum.success, res, 5);
            }
          } else {
            return error("User Not Found.", statusCodeEnum.notFound, res, {});
          }
        }
      });
    } else {
      return error("Please login again.", statusCodeEnum.unauthorized, res, {});
    }
  } catch (error) {
    return exception("", statusCodeEnum.internalServerError, res, error);
  }
};

exports.signUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        error: errors.array(),
      });
    }
    const password = await encryptPassword(req.body.password);
    const data = { name: req.body.name, email: req.body.email, password: password, role: req.body.role, status: req.body.status };
    logger.info(`data ${JSON.stringify(data)}`);
    const result = await adminModel.create(data);
    if (result) {
      let data = {
        user: result._id,
      };
      return success("User Created. Please login.", data, statusCodeEnum.created, res, 5);
    } else {
      return error("Unable to create the user.", statusCodeEnum.internalServerError, res, { user: 0 });
    }
  } catch (error) {
    console.error(error);
    return exception("", statusCodeEnum.internalServerError, res, error);
  }
};
