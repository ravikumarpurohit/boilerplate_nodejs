const mongoose = require("mongoose");

const options = {
  collection: "User",
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
      enum: ["MALE", "FEMALE", "OTHER"],
    },
    address: [address],
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  options
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
