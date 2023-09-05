const mongoose = require("mongoose");

const options = {
  collection: "adminUser",
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

const adminSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, require: true },
    password: { type: String, require: true },
    role: { type: String, require: true },
    status: { type: String },
  },
  options
);

const adminModel = mongoose.model("adminUser", adminSchema);
module.exports = adminModel;
