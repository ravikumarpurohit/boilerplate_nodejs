import mongoose from "mongoose";

const options = {
  collection: "catalogue",
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

const catalogueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  document: {
    type: String,
    required: [true, "Document file is required"],
  },
  thumbnail: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  thumbnail: {
    type: String,
    default: null,
  },
  sizeName: { 
    type: String,
    trim: true,
    default: null,
  },
  finishName: { 
    type: String,
    trim: true,
    default: null,
  },
}, options);

const catalogueModel =
  mongoose.models.catalogue || mongoose.model("catalogue", catalogueSchema);

export default catalogueModel;