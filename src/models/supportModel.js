import mongoose from "mongoose";

const options = {
  collection: "support",
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

const supportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
    },
    mobile: { type: String },
    pincode: { type: String },
    userType: { type: String },
    lookingFor: { type: String },
    description: { type: String, required: true },
    subject: { type: String },
  },
  options
);

const supportModel =
  mongoose.models.support || mongoose.model("support", supportSchema);

export default supportModel;
