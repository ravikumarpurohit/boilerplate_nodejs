import mongoose from "mongoose";

const options = {
  collection: "order",
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

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
   customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
    },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },

    proforma: {
      invoiceNo: { type: String, trim: true },
      date: { type: Date, default: Date.now },

      billTo: {
        name: { type: String, trim: true },
        address: { type: String, trim: true },
        gstin: { type: String, trim: true },
        phone: { type: String, trim: true },
      },

      shipTo: {
        name: { type: String, trim: true },
        address: { type: String, trim: true },
        phone: { type: String, trim: true },
      },

      items: [
        {
          productId: String,
          description: { type: String, trim: true },
          series: { type: String, trim: true },
          size: { type: String, trim: true },
          surface: { type: String, trim: true },
          image: { type: String, trim: true },
          quantity: { type: Number, default: 0 },
          unit: { type: String, default: "Box" },
          rate: { type: Number, default: 0 },
          amount: { type: Number, default: 0 },
        },
      ],

      bankDetails: {
        bankName: { type: String, trim: true },
        accName: { type: String, trim: true },
        accNo: { type: String, trim: true },
        ifsc: { type: String, trim: true },
        branch: { type: String, trim: true },
      },

      subTotal: { type: Number, default: 0 },
      taxPercentage: { type: Number, default: 18 },
      taxAmount: { type: Number, default: 0 },
      shippingCharges: { type: Number, default: 0 },
      grandTotal: { type: Number, default: 0 },

      terms: [{ type: String, trim: true }],
    },

    status: {
      type: String,
      enum: ["New", "Sent", "Edited", "Confirmed", "Shipped", "Cancelled"],
      default: "New",
    },

    sentProformaUrl: String,
  },
  options
);

const OrderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);
export default OrderModel;