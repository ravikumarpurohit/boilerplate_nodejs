const mongoose = require("mongoose");

const Gender = {
  MALE: "Male", FEMALE: "Female", OTHER: "Other"
}

const Role = {
  ADMIN: "Admin", USER: "User"
}

const options = {
  collection: "users",
  versionKey: false,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
  timestamps: {
    createdAt: "createdDate",
    updatedAt: "updatedDate",
  },
};

const address = new mongoose.Schema({
  address1: { type: String },
  address2: { type: String },
  address3: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  postcode: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    emailVerify: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    mobile: { type: Number },
    gender: {
      type: String,
      enum: Gender,
    },
    address: address,
    role: {
      type: String,
      enum: Role,
      default: Role.USER,
    },

    isActive: {
      type: Boolean,
      default: true
    },
    profileImage: { type: String },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      index: true,
      require: true
    },
  },
  options
);

const userModel = mongoose.model("users", userSchema);
module.exports = {
  userModel,
  Role
};
