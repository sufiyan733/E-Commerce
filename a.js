import mongoose from "mongoose";
import Product from "./models/product.js"; // adjust path if needed

async function fixProductIds() {
  try {
   
    await mongoose.connect(process.env.DATABASE_URL);

    // Get all products
    const products = await Product.find();
    for (const p of products) {
      if (typeof p.id !== "string") {
        p.id = String(p.id); // convert number -> string
        await p.save();
        console.log(`Fixed product ID: ${p.id}`);
      }
    }

    console.log("✅ All product IDs are now strings.");
    process.exit();
  } catch (err) {
    console.error("❌ Error fixing product IDs:", err);
    process.exit(1);
  }
}

fixProductIds();
