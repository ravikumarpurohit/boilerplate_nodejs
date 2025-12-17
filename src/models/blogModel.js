const mongoose = require("mongoose");

const options = {
  collection: "blogs",
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

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subTitle: { type: String },
    text: { type: String, required: true },
    coverImage: { type: String },
    metaData: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      index: true,
    },
    order: {
      type: Number,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  options
);

const blogModel = mongoose.models.blogs || mongoose.model("blogs", blogSchema);
module.exports = blogModel;
