const userModel = require("../models/userModel");
const { success, successAuth, error, exception } = require("../models/responsesModels/responseModel");
const { statusCodeEnum } = require("../utils/commonFun");
const { checkPassword, encryptPassword } = require("../utils/passwordCheck");
const { JWTSecret } = require("../config/index");
const jwt = require("jsonwebtoken");
const mailer = require("../utils/emailUtility");

exports.signUp = async (req, res) => {
  try {

    const userExist = await userModel.findOne({ email: req.body.email });
    if (userExist) {
      return error("Email already exists", statusCodeEnum.internalServerError, res);

    }
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
      const emailSender = await mailer(req.body.email, result._id);
      let data = {
        user: result._id,
      };

      return success("User Created. Please login.", data, statusCodeEnum.created, res, 5);
    } else {
      return error("Unable to create the User.", statusCodeEnum.internalServerError, res);
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
      res.cookie("access_token", _token, cookieOptions);
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
    res.clearCookie("access_token");
    let data = {
      loggedOut: 1,
    };
    return success("Successfully logout.", data, statusCodeEnum.success, res, 5);
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
    const data = await userModel.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    return success("Customer Details updated.", "", statusCodeEnum.created, res, 5);
  } catch (e) {
    console.log(e);
    return error("Customer Details not updated.", statusCodeEnum.internalServerError, res, error);
  }
};

exports.getById = async (req, res) => {
  try {
    const query = { firstName: 1, lastName: 1, email: 1, emailVerify: 1, mobile: 1, gender: 1, address: 1, role: 1, status: 1 }

    const _id = req.params._id;
    console.log(_id);
    const data = await userModel.findById(_id).select(query);
    return success("", data, statusCodeEnum.created, res, 5);
  } catch (e) {
    console.log(e);
    return error("", statusCodeEnum.internalServerError, res, error);
  }
};

exports.get = async (req, res) => {
  try {
    const query = { firstName: 1, lastName: 1, email: 1, emailVerify: 1, mobile: 1, gender: 1, address: 1, role: 1, status: 1 }
    const data = await userModel.find().select(query);
    return success("", data, statusCodeEnum.created, res, 5);
  } catch (e) {
    console.log(e);
    return error("", statusCodeEnum.internalServerError, res, error);
  }
};

exports.changePassword = async (req, res) => {
  try {

    const _id = req.params._id;
    const oldPassword = req.body.oldPassword;
    const password = req.body.password;
    const passwordVerify = req.body.passwordVerify;

    if (password != passwordVerify) {
      return error("Passwords not match.", statusCodeEnum.badRequest, res, {});
    };
    const newPassword = await encryptPassword(password);
    const user = await userModel.findById(_id);
    const isPassword = await checkPassword(oldPassword, user.password);
    if (!isPassword) {
      return error("oldPasswords not match.", statusCodeEnum.badRequest, res, {});
    }


    await userModel.findByIdAndUpdate(_id, { password: newPassword }, { new: true });

    return success("Password changed successfully", "", statusCodeEnum.success, res, 5);
  } catch (e) {
    console.log(error);
    return error("Password not changed.", statusCodeEnum.internalServerError, res, error);
  }
};

exports.emailVerify = async (req, res) => {
  try {
    console.log(req.body);
    const _id = req.params._id;
    await userModel.findByIdAndUpdate(_id, { emailVerify: true }, {
      new: true,
    });
    return success("Email Verified successfully.", "", statusCodeEnum.created, res, 5);
  } catch (e) {
    console.log(e);
    return error("Email not Verified.", statusCodeEnum.internalServerError, res, error);
  }
};


exports.profileImage = async (req, res) => {
  try {

    if (req.file.filename == 0) {
      return error("Kindly Upload Profile Images properly.", statusCodeEnum.internalServerError, res, error);
    }

    const query = { firstName: 1, lastName: 1, email: 1, emailVerify: 1, mobile: 1, gender: 1, address: 1, role: 1, status: 1 }
    const id = req.params._id;
    const data = await userModel.findByIdAndUpdate(id, { profileImage: req.file.filename }, { new: true }).select(query);
    console.log(data);

    return success("Profile Image added successfully.", data, statusCodeEnum.created, res, 5);

  } catch (e) {
    console.log(e);
    return error("Profile Image not added.", statusCodeEnum.internalServerError, res, error);
  }
}