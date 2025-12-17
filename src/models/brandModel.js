import mongoose from "mongoose";
const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.models.brand || mongoose.model("brand", brandSchema);