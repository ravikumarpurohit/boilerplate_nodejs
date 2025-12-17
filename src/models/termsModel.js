import mongoose from "mongoose";

const options = {
  collection: "terms",
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

const termsSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  options
);

const TermsModel = mongoose.models.terms || mongoose.model("terms", termsSchema);
export default TermsModel;