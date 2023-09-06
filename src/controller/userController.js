const userModel = require("../models/userModel");
const { success, successAuth, error, exception } = require("../models/responsesModels/responseModel");
const { statusCodeEnum } = require("../utils/commonFun");
const { checkPassword, encryptPassword } = require("../utils/passwordCheck");
const { JWTSecret } = require("../config/index");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  try {

    const password = await encryptPassword(req.body.password);

    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      emailVerify: req.body.emailVerify,
      password: password,
      mobile: req.body.mobile,
      gender: req.body.gender,
      address: req.body.address,
      role: req.body.role,
      status: req.body.status
    };

    const result = await userModel.create(data);
    if (result) {
      let data = {
        user: result._id,
      };
      return success("User Created. Please login.", data, statusCodeEnum.created, res, 5);
    } else {
      return error("Unable to create the User.", statusCodeEnum.internalServerError, res, { user: 0 });
    }
  } catch (error) {
    console.error(error);
    return exception("", statusCodeEnum.internalServerError, res, error);
  }

};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await userModel
      .findOne(
        {
          email: {
            $regex: new RegExp(`^${email}$`, "i"),
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
      if (user.status != "ACTIVE") {
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
      res.cookie("admin_access_token", _token, cookieOptions);
      let data = {
        user: { id: user._id, name: user.firstName, email: user.email, status: user.status },
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
    res.clearCookie("admin_access_token");
    let data = {
      loggedOut: 1,
    };
    return success("Succesfuly logout.", data, statusCodeEnum.success, res, 5);
  } catch (error) {
    console.error(error);
    return exception("", statusCodeEnum.internalServerError, res, error);
  }
};

exports.delete = async (req, res) => {
  try {
    console.log(req.body);
    const _id = req.params._id;
    const data = { "status": "INACTIVE" };
     await userModel.findByIdAndUpdate(_id, data, { new: true });
    return success("Customer Deleted", "", statusCodeEnum.success, res, 5);
  } catch (e) {
    console.log(error);
    return error("Customer not Deleted.", statusCodeEnum.internalServerError, res, error);
  }
};

exports.update = async (req, res) => {
  try {
    console.log(req.body);
    const _id = req.params._id;
    const getId = await userModel.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    return success("Customer Details updated.", getId, statusCodeEnum.created, res, 5);
  } catch (e) {
    console.log(e);
    return error("Customer Details not updated.", statusCodeEnum.internalServerError, res, error);
  }
};

exports.getById = async (req, res) => {
  try {
    const _id = req.params._id;
    console.log(_id);
    const data = await userModel.findById(_id);
    return success("", data, statusCodeEnum.created, res, 5);
  } catch (e) {
    console.log(e);
    return error("", statusCodeEnum.internalServerError, res, error);
  }
};

exports.get = async (req, res) => {
  try {
    const get = await userModel.find();
    res.send(get);
  } catch (e) {
    console.log(e);
    return error("", statusCodeEnum.internalServerError, res, error);
  }
};