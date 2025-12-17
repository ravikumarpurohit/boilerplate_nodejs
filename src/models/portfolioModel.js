const mongoose = require("mongoose");

const options = {
  collection: "portfolio",
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

const portfolioSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    description: { type: String, require: true },
    skills: { type: String },
    images: { type: [String], default: [] },
    platform: { type: String },
    domain: { type: String },
    metaData: { type: String },
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

mongoose.models.portfolio && delete mongoose.models.portfolio;

const portfolioModel =
  mongoose.models.portfolio || mongoose.model("portfolio", portfolioSchema);
module.exports = portfolioModel;
