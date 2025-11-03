import { connectDB } from "@/lib/mongodb";
import product from "@/models/product";

import { log } from "console";

export async function GET() {
    try {
        await connectDB();
        const products = await product.find({}).lean();
      return Response.json(products);
        
    } catch (error) {
        return Response.json({ error: "Failed to fetch products" }, { status: 500 });

    }
}

export async function POST(request) {
    try {

        await connectDB();
        const data = await request.json();
        const newProduct = new product(data);
        await newProduct.save();
        return Response.json(newProduct);
    } catch (error) {
        return Response.json({ error: "Failed to add product" }, { status: 500 });

    }
}
export async function DELETE(req) {
    try {
          await connectDB();
          const { id } = await req.json();
          await product.deleteOne({ id: id });
          return Response.json({ message: "Product deleted" });
    } catch (error) {
          return Response.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
