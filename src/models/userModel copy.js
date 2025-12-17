// models/userModel.js
const mongoose = require("mongoose");

const Role = {
  ADMIN: "Admin",
  USER: "User",
};

const options = {
  collection: "users",
  versionKey: false,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: {
    createdAt: "createdDate",
    updatedAt: "updatedDate",
  },
};

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    emailVerify: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
    },
    mobile: { type: Number, unique: true },
    image: {
      type: String, // URL to the image
    },
    role: {
      type: String,
      enum: Role,
      default: Role.USER,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      index: true,
    },
  },
  options
);

const userModel = mongoose.models.users || mongoose.model("users", userSchema);
module.exports = {
  userModel,
  Role,
};