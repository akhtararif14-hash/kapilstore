// models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 }, // 0 = "contact for price"
    actualPrice: { type: Number },
    unit: { type: String, default: "" },
    images: { type: [String], default: [] },
    //stationery | assignment | tuition | earn-rent | others
    category: { type: String, required: true, default: "stationery" },
    // subcategory id e.g. "books-notebooks", "pens", "fast-food"
    subcategory: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
