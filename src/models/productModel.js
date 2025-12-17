// import mongoose from "mongoose";

// const options = {
//   collection: "products",
//   versionKey: false,
//   toObject: {
//     virtuals: true,
//   },
//   toJSON: {
//     virtuals: true,
//   },
//   timestamps: {
//     createdAt: "createdDate",
//     updatedAt: "updatedDate",
//   },
// };

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       // required: true,
//       trim: true
//     },
//     size: {
//       type: String,
//       trim: true
//     },
//     finishes: {
//       type: String,
//       trim: true
//     },

//     images: [
//       {
//         fileName: { type: String, required: true },
//         originalName: { type: String },
//         url: { type: String },
//       },
//     ],
//     categoryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "category",
//     },
//     subCategoryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "category",
//     },
//     tags: [{ type: String }],
//     uploadedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "users",
//     },
//   },
//   options
// );

// const productModel =
//   mongoose.models.products || mongoose.model("products", productSchema);

// export default productModel;

// import mongoose from "mongoose";

// const options = {
//   collection: "products",
//   versionKey: false,
//   toObject: {
//     virtuals: true,
//   },
//   toJSON: {
//     virtuals: true,
//   },
//   timestamps: {
//     createdAt: "createdDate",
//     updatedAt: "updatedDate",
//   },
// };

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       // required: true,
//       trim: true
//     },
//     size: {
//       type: String,
//       trim: true
//     },
//     finishes: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "finishes",
//       trim: true
//     },

//     price: {
//       type: Number,
//     },

//     description: {
//       type: String,
//       trim: true
//     },

//     images: [
//       {
//         fileName: { type: String, required: true },
//         originalName: { type: String },
//         url: { type: String },
//       },
//     ],
//     categoryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "category",
//     },
//     subCategoryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "category",
//     },
//     tags: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "tags",
//       }
//     ],
//     uploadedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "users",
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   options
// );

// const productModel =
//   mongoose.models.products || mongoose.model("products", productSchema);

// export default productModel;

import mongoose from "mongoose";

const options = {
  collection: "products",
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

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    designNumber: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    surface: {
      type: String,
      trim: true,
    },
    finishes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "finishes",
      trim: true,
    },
    grade: {
      type: String,
      trim: true,
    },
    batch: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    weight: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [
      {
        fileName: { type: String, required: true },
        originalName: { type: String },
        url: { type: String },
      },
    ],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tags",
      },
    ],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    showOnLanding: {
      type: Boolean,
      default: false,
    },
    isOrderable: {
      type: Boolean,
      default: true,
    },
  },
  options
);

const productModel =
  mongoose.models.products || mongoose.model("products", productSchema);

export default productModel;
