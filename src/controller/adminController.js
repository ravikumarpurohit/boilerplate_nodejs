const { adminModel } = require("../models/adminModel");
const { success, successAuth, error, exception, } = require("../models/responsesModels/responseModel");
const { StatusCodes } = require("http-status-codes");
const { checkPassword, encryptPassword } = require("../utils/passwordCheck");
const { JWTSecret } = require("../config/index");
const jwt = require("jsonwebtoken");
const { mailer, setPassword } = require("../utils/emailUtility");
const { logger } = require("../utils/logger");

exports.signUp = async (req, res) => {
  logger.info(`body = ${JSON.stringify(req.body)}`);

  try {
    const userExist = await adminModel.findOne({ email: req.body.email });
    if (userExist) {
      return error("Email already exists", StatusCodes.BAD_REQUEST, res);
    }

    const password = await encryptPassword(req.body.password);

    const data = {
      fullName: req.body.fullName,
      email: req.body.email,
      emailVerify: req.body.emailVerify,
      password: password,
      mobile: req.body.mobile,
      gender: req.body.gender,
      address: req.body.address,
      role: req.body.role,
      isActive: req.body.isActive,
    };

    const result = await adminModel.create(data);

    if (result) {
      const emailSender = await mailer(req.body.email, result._id);
      let data = {
        _id: result._id,
      };

      return success("User Created. Please login.", data, StatusCodes.CREATED, res, 5);
    } else {
      return error("Unable to create the User.", StatusCodes.INTERNAL_SERVER_ERROR, res);
    }
  } catch (e) {
    logger.error(`Error while add User | error ${e}`);
    return exception("", StatusCodes.INTERNAL_SERVER_ERROR, res, error);
  }
};

exports.signIn = async (req, res) => {
  logger.info(`body = ${JSON.stringify(req.body)}`);

  try {
    const { email, password } = req.body;
    let user = await adminModel
      .findOne(
        {
          email: {
            $regex: new RegExp(`^${email}$`, "i"),
          },
        },
        "_id email fullName password isActive role "
      )
      .lean();
    if (!user || Object.keys(user).length == 0) {
      return error("user does not exist.", StatusCodes.BAD_REQUEST, res, {});
    }
    if (user.isActive != true) {
      return success("You are inactive", "", StatusCodes.BAD_REQUEST, res, 5);
    }
    const isPassword = await checkPassword(password, user.password);
    if (isPassword) {
      const { password, ..._user } = user;
      const token = jwt.sign({ _id: _user._id, role: _user.role }, JWTSecret, {
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
      res.cookie("token", token, cookieOptions);

      return successAuth("", token, StatusCodes.OK, res, 5);
    }
    return error("incorrect password.", StatusCodes.UNAUTHORIZED, res, {});
  } catch (e) {
    logger.error(`Error while signIn | req ${JSON.stringify(req.body)} | error ${e}`);
    return exception("", StatusCodes.INTERNAL_SERVER_ERROR, res, error);
  }
};

exports.checkUser = async (req, res) => {
  logger.info(`checkUser = ${JSON.stringify(req.user)}`)
  try {
    const _id = req.user._id;
    const user = await adminModel.findById(_id);
    if (!user) {
      return error("user does not exist.", StatusCodes.BAD_REQUEST, res, {});
    }
    const query = [
      {
        $match: {
          _id: user._id,
        },
      },

      {
        $project: {
          _id: 1,
          fullName: 1,
          gender: 1,
          emailVerify: 1,
          role: 1,
          email: 1,
        }
      }
    ];
    const userData = await adminModel.aggregate(query);
    console.log(userData);
    const token = req.headers.authorization.replace("Bearer ", "");
    return successAuth("", token, userData[0], StatusCodes.OK, res, 5);
  } catch (e) {
    logger.error(`Error while check User | error ${e}`);
    return error("", StatusCodes.INTERNAL_SERVER_ERROR, res, error);
  }
};

exports.signOut = (req, res) => {
  try {
    res.clearCookie("token");
    let data = {
      loggedOut: 1,
    };
    return success("Successfully logout.", data, StatusCodes.OK, res, 5);
  } catch (e) {
    logger.error(`Error while signOut | error ${e}`);
    return exception("", StatusCodes.INTERNAL_SERVER_ERROR, res, error);
  }
};

exports.delete = async (req, res) => {
  logger.info(`params = ${req.params?._id}`);

  try {
    const _id = req.params._id;
    const data = { isActive: false };
    await adminModel.findByIdAndUpdate(_id, data, { new: true });

    return success("User Deleted", "", StatusCodes.OK, res, 5);
  } catch (e) {
    logger.error(`Error while delete User | error ${e}`);
    return error(
      "User not Deleted.",
      StatusCodes.INTERNAL_SERVER_ERROR,
      res,
      error
    );
  }
};

exports.update = async (req, res) => {
  logger.info(`body = ${JSON.stringify(req.body)} | params = ${req.params?._id}`);

  try {

    const _id = req.params._id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const adminExist = await adminModel.findOne({
      $or: [
        { email: req.body.email },
        { mobile: req.body.mobile }
      ]
    });

    if (adminExist) {
      if (adminExist.email === req.body.email) {
        return error("Email already exists", StatusCodes.BAD_REQUEST, res);
      } else {
        return error("Mobile Number already exists", StatusCodes.BAD_REQUEST, res);
      }
    }

    const data = await adminModel.findByIdAndUpdate(_id, req.body, { runValidators: true });
    return success("User Details updated.", "", StatusCodes.CREATED, res, 5);
  } catch (e) {
    logger.error(`Error while update User | error ${e}`);
    return error("User Details not updated.", StatusCodes.INTERNAL_SERVER_ERROR, res, error);
  }
};

exports.getById = async (req, res) => {
  logger.info(`params = ${req.params?._id}`);

  try {
    const query = {
      fullName: 1,
      email: 1,
      emailVerify: 1,
      mobile: 1,
      gender: 1,
      address: 1,
      profileImage: 1,
      role: 1,
    };

    const _id = req.params._id;
    const data = await adminModel
      .findOne({ _id: _id, isActive: true })
      .select(query);
    if (!data) {
      return success("User not found", data, StatusCodes.BAD_REQUEST, res, 5);
    }

    if (data.profileImage) {
      data.profileImage = `/admin/image/${data.profileImage}`;
    }

    return success("", data, StatusCodes.CREATED, res, 5);
  } catch (e) {
    logger.error(`Error while get user by Id | error ${e}`);
    return error("", StatusCodes.INTERNAL_SERVER_ERROR, res, error);
  }
};

exports.get = async (req, res) => {
  try {
    const page = req.query.page ? req.query.page : 1;
    const sort = req.query.sort;
    const limit = req.query.limit ? req.query.limit : 10;
    const search = req.query.search;
    const query = {
      fullName: 1,
      email: 1,
      emailVerify: 1,
      mobile: 1,
      gender: 1,
      address: 1,
      role: 1,
      profileImage: 1,
      isActive: 1,
    };

    let filter = {};
    if (search) {
      filter = {
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    let userList,
      collection_count = 1;
    let skip = (page - 1) * limit;

    let customSort = {};
    if (sort) {
      if (sort === "_id") {
        customSort = {
          _id: -1,
        };
      }
      collection_count = await adminModel.find(filter).count();
      userList = await adminModel
        .find(filter)
        .sort(customSort)
        .skip(skip)
        .limit(limit)
        .select(query);
    } else {
      collection_count = await adminModel.find(filter).count();
      userList = await adminModel
        .find(filter)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .select(query);
    }

    // Transform profileImage to URL form
    userList = userList.map(user => {
      if (user.profileImage) {
        user.profileImage = `/admin/image/${user.profileImage}`;
      }
      return user;
    });

    const totalPage = Math.ceil(collection_count / limit);

    return success("", { userList, totalPage }, StatusCodes.OK, res, 5);
  } catch (e) {
    logger.error(`Error while get user list | error ${e}`);
    return error("", StatusCodes.INTERNAL_SERVER_ERROR, res, e);
  }
};

exports.changePassword = async (req, res) => {
  logger.info(`body = ${JSON.stringify(req.body)} | params = ${req.params?._id}`);

  try {
    const _id = req.params._id;
    const oldPassword = req.body.oldPassword;
    const password = req.body.password;
    const passwordVerify = req.body.passwordVerify;

    if (password != passwordVerify) {
      return error("Passwords not match.", StatusCodes.BAD_REQUEST, res, {});
    }
    const newPassword = await encryptPassword(password);
    const user = await adminModel.findById(_id);
    const isPassword = await checkPassword(oldPassword, user.password);
    if (!isPassword) {
      return error("oldPasswords not match.", StatusCodes.BAD_REQUEST, res, {});
    }

    await adminModel.findByIdAndUpdate(
      _id,
      { password: newPassword },
      { new: true }
    );

    return success("Password changed successfully", "", StatusCodes.OK, res, 5);
  } catch (e) {
    logger.error(`Error while change Password | error ${e}`);
    return error("Password not changed.", StatusCodes.INTERNAL_SERVER_ERROR, res, error);
  }
};

exports.emailVerify = async (req, res) => {
  logger.info(`user = ${req.user?._id}  | params = ${req.params?._id}`);

  try {
    const _id = req.params._id;
    await adminModel.findByIdAndUpdate(
      _id,
      { emailVerify: true },
      {
        new: true,
      }
    );
    return success("Email Verified successfully.", "", StatusCodes.OK, res, 5);
  } catch (e) {
    logger.error(`Error while verify email | error ${e}`);
    return error("Email not Verified.", StatusCodes.INTERNAL_SERVER_ERROR, res, error);
  }
};

exports.profileImage = async (req, res) => {
  logger.info(`file =${JSON.stringify(req?.file)} | params = ${req.params?._id}`);

  try {
    const filename = req.file.filename;
    if (filename == 0) {
      return error("Kindly Upload Profile Images properly.", StatusCodes.INTERNAL_SERVER_ERROR, res, error);
    }

    const query = {
      fullName: 1,
      email: 1,
      emailVerify: 1,
      mobile: 1,
      gender: 1,
      address: 1,
      role: 1,
    };

    const id = req.params._id;
    const data = await adminModel
      .findByIdAndUpdate(id, { profileImage: filename }, { new: true })
      .select(query);

    return success(
      "Profile Image added successfully.",
      data,
      StatusCodes.CREATED,
      res,
      5
    );
  } catch (e) {
    logger.error(`Error while set profileImage | error ${e}`);
    return error(
      "Profile Image not added.",
      StatusCodes.INTERNAL_SERVER_ERROR,
      res,
      error
    );
  }
};
