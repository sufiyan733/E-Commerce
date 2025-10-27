import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // your custom id
    title: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discountPercent: { type: Number, required: true },
    category: { type: String, required: true },
     rating: {
      rate: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    },
    image: { type: String, required: true },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);


const Product =
  mongoose.models?.Product || mongoose.model("Product", productSchema);

export default Product;

