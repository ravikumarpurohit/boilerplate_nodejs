import { userModel } from "../models/userModel.js";
import {
  success,
  successAuth,
  error,
  exception,
} from "../models/responsesModels/responseModel.js";
import { StatusCodes } from "http-status-codes";
import { checkPassword, encryptPassword } from "../utils/passwordCheck.js";
import { JWTSecret } from "../config/index.js";
import jwt from "jsonwebtoken";
// import { mailer, setPassword } from "../utils/emailUtility.js";

export const signUp = async (req, res) => {
  try {
    const userExist = await userModel.findOne({ email: req.body.email });
    if (userExist) {
      return error("Email already exists", StatusCodes.BAD_REQUEST, res);
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
      isActive: req.body.isActive,
    };

    const result = await userModel.create(data);

  

      return success(
        "User Created. Please login.",
        data,
        StatusCodes.CREATED,
        res,
        5
      );
    
  } catch (error) {
    console.error(error);
    return exception("", StatusCodes.INTERNAL_SERVER_ERROR, res, error);
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await userModel
      .findOne(
        {
          email: {
            $regex: new RegExp(`^${email}$`, "i"),
          },
        },
        "_id email firstName password isActive role"
      )
      .lean();

    if (!user || Object.keys(user).length == 0) {
      return error("user does not exist.", StatusCodes.BAD_REQUEST, res, {});
    }

    const isPassword = await checkPassword(password, user.password);
    if (isPassword) {
      if (user.isActive != true) {
        return success("You are inactive", "", StatusCodes.BAD_REQUEST, res, 5);
      }

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

      const userData = await userModel.aggregate([
        {
          $match: {
            _id: user._id,
          },
        },
        {
          $lookup: {
            from: "employees",
            localField: "employeeId",
            foreignField: "_id",
            as: "employee",
          },
        },
        {
          $unwind: "$employee",
        },
        {
          $project: {
            _id: 1,
            employeeId: 1,
            employeeCode: "$employee.employeeCode",
            firstName: "$employee.firstName",
            middleName: "$employee.middleName",
            surName: "$employee.surName",
            email: "$employee.email",
            mobile: "$employee.mobile",
            gender: "$employee.gender",
            isActive: "$employee.isActive",
            emailVerify: 1,
            role: 1,
          },
        },
      ]);
      let data = "";
      if (userData.length > 0) {
        data = userData[0];
      } else {
        data = {
          id: user._id,
          name: user.firstName,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        };
      }
      return successAuth("", token, data, StatusCodes.OK, res, 5);
    }
    return error("incorrect password.", StatusCodes.UNAUTHORIZED, res, {});
  } catch (error) {
    console.error(error);
    return exception("", StatusCodes.INTERNAL_SERVER_ERROR, res, error);
  }
};

export const checkUser = async (req, res) => {
  try {
    const _id = req.user._id;
    console.log(_id);
    const query = {
      firstName: 1,
      lastName: 1,
      email: 1,
      mobile: 1,
      gender: 1,
      role: 1,
    };
    const data = await userModel.findById(_id).select(query);
    if (!data) {
      return error("user does not exist.", StatusCodes.BAD_REQUEST, res, {});
    }
    return successAuth("", req.token, { user: data }, StatusCodes.OK, res, 5);
  } catch (e) {
    console.log(e);
    return error("", StatusCodes.INTERNAL_SERVER_ERROR, res, error);
  }
};

export const signOut = (req, res) => {
  try {
    res.clearCookie("token");
    let data = {
      loggedOut: 1,
    };
    return success("Successfully logout.", data, StatusCodes.OK, res, 5);
  } catch (error) {
    console.error(error);
    return exception("", StatusCodes.INTERNAL_SERVER_ERROR, res, error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    console.log(req.body);
    const _id = req.params._id;
    const data = { isActive: false };
    await userModel.findByIdAndUpdate(_id, data, { new: true });

    return success("User Deleted", "", StatusCodes.OK, res, 5);
  } catch (e) {
    console.log(e);
    return error(
      "User not Deleted.",
      StatusCodes.INTERNAL_SERVER_ERROR,
      res,
      error
    );
  }
};

export const update = async (req, res) => {
  try {
    console.log(req.body);
    const _id = req.params._id;
    const data = await userModel.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    return success(
      "Customer Details updated.",
      "",
      StatusCodes.CREATED,
      res,
      5
    );
  } catch (e) {
    console.log(e);
    return error(
      "Customer Details not updated.",
      StatusCodes.INTERNAL_SERVER_ERROR,
      res,
      error
    );
  }
};

export const getById = async (req, res) => {
  try {
    const query = {
      firstName: 1,
      lastName: 1,
      email: 1,
      emailVerify: 1,
      mobile: 1,
      gender: 1,
      address: 1,
      role: 1,
      status: 1,
    };

    const _id = req.params._id;
    console.log(_id);
    const data = await userModel.findById(_id).select(query);
    return success("", data, StatusCodes.CREATED, res, 5);
  } catch (e) {
    console.log(e);
    return error("", StatusCodes.INTERNAL_SERVER_ERROR, res, error);
  }
};

export const get = async (req, res) => {
  try {
    const query = {
      firstName: 1,
      lastName: 1,
      email: 1,
      emailVerify: 1,
      mobile: 1,
      gender: 1,
      address: 1,
      role: 1,
      status: 1,
    };
    const data = await userModel.find().select(query);
    return success("", data, StatusCodes.CREATED, res, 5);
  } catch (e) {
    console.log(e);
    return error("", StatusCodes.INTERNAL_SERVER_ERROR, res, error);
  }
};

export const changePassword = async (req, res) => {
  try {
    const _id = req.params._id;
    const oldPassword = req.body.oldPassword;
    const password = req.body.password;
    const passwordVerify = req.body.passwordVerify;

    if (password != passwordVerify) {
      return error("Passwords not match.", StatusCodes.BAD_REQUEST, res, {});
    }
    const newPassword = await encryptPassword(password);
    const user = await userModel.findById(_id);
    const isPassword = await checkPassword(oldPassword, user.password);
    if (!isPassword) {
      return error("oldPasswords not match.", StatusCodes.BAD_REQUEST, res, {});
    }

    await userModel.findByIdAndUpdate(
      _id,
      { password: newPassword },
      { new: true }
    );

    return success("Password changed successfully", "", StatusCodes.OK, res, 5);
  } catch (e) {
    console.log(error);
    return error(
      "Password not changed.",
      StatusCodes.INTERNAL_SERVER_ERROR,
      res,
      error
    );
  }
};

export const emailVerify = async (req, res) => {
  try {
    console.log(req.body);
    const _id = req.params._id;
    await userModel.findByIdAndUpdate(
      _id,
      { emailVerify: true },
      {
        new: true,
      }
    );
    return success("Email Verified successfully.", "", StatusCodes.OK, res, 5);
  } catch (e) {
    console.log(e);
    return error(
      "Email not Verified.",
      StatusCodes.INTERNAL_SERVER_ERROR,
      res,
      error
    );
  }
};

export const profileImage = async (req, res) => {
  try {
    const filename = req.file.filename;
    if (filename == 0) {
      return error(
        "Kindly Upload Profile Images properly.",
        StatusCodes.INTERNAL_SERVER_ERROR,
        res,
        error
      );
    }

    const query = {
      firstName: 1,
      lastName: 1,
      email: 1,
      emailVerify: 1,
      mobile: 1,
      gender: 1,
      address: 1,
      role: 1,
      status: 1,
    };
    const id = req.params._id;
    const data = await userModel
      .findByIdAndUpdate(id, { profileImage: filename }, { new: true })
      .select(query);
    console.log(data);

    return success(
      "Profile Image added successfully.",
      data,
      StatusCodes.CREATED,
      res,
      5
    );
  } catch (e) {
    console.log(e);
    return error(
      "Profile Image not added.",
      StatusCodes.INTERNAL_SERVER_ERROR,
      res,
      error
    );
  }
};

export const activeUser = async (req, res) => {
  try {
    const empId = req.params._id;
    const employeeId = empId;
    const query = { email: 1, gender: 1, designation: 1, isActive: 1 };

    const empData = await userModel.findById(empId).select(query);
    const data = {
      empData: empData,
      employeeId: employeeId,
      email: empData.email,
      password: req.body.password,
    };
    console.log(data);
    const result = await userModel.create(data);

    if (result) {
      const emailSender = await setPassword(empData.email, result._id);
      let data = {
        user: result._id,
      };

      return success(
        "User added successfully",
        data,
        StatusCodes.CREATED,
        res,
        5
      );
    }
  } catch (e) {
    console.log(e);
    return error(
      "User not added",
      StatusCodes.INTERNAL_SERVER_ERROR,
      res,
      error
    );
  }
};

export const setUserPassword = async (req, res) => {
  try {
    console.log(req.body);
    const _id = req.params._id;
    await userModel.findById(_id);
    res.sendfile("index.html", { root: __dirname });
  } catch (e) {
    console.log(e);
    return error(
      "Email not Verified.",
      StatusCodes.INTERNAL_SERVER_ERROR,
      res,
      error
    );
  }
};

export const updatePassword = async (req, res) => {
  try {
    const _id = req.params._id;
    const password = req.body.password;
    const reEnterPassword = req.body.reEnterPassword;

    if (password != reEnterPassword) {
      return error("Passwords not match.", StatusCodes.BAD_REQUEST, res, {});
    }
    const newPassword = await encryptPassword(password);

    await userModel.findByIdAndUpdate(
      _id,
      { password: newPassword },
      { new: true }
    );

    return success("Password Updated successfully", "", StatusCodes.OK, res, 5);
  } catch (e) {
    console.log(error);
    return error(
      "Password not Update.",
      StatusCodes.INTERNAL_SERVER_ERROR,
      res,
      error
    );
  }
};
