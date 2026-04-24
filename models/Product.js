// models/Product.js
import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  label: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number },
});

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 },
    actualPrice: { type: Number },
    unit: { type: String, default: "" },
    images: { type: [String], default: [] },
    category: { type: String, required: true, default: "stationery" },
    subcategory: { type: String, default: "" },
    variants: { type: [VariantSchema], default: [] }, // ← ADD THIS LINE
  },
  { timestamps: true },
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);