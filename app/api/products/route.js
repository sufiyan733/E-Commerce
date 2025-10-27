import { connectDB } from "@/lib/mongodb";
import product from "@/models/product";

import { log } from "console";

export async function GET() {
    try {
        await connectDB();
        const products = await product.find({}).lean();


        return Response.json(products);
    } catch (error) {
        console.log(error);
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
        console.log(error);
        return Response.json({ error: "Failed to add product" }, { status: 500 });

    }
}
export async function DELETE(req) {
    try {
        await connectDB();
        const { id } = await req.json();
        // ✅ get actual id
        //    const v= await product.find({}); // ✅ FIXED - real variable used
        //    const l=v[id-1];
        //    const j=l._id;




        await product.deleteOne({ id: id })

        return Response.json({ message: "Product deleted" });
    } catch (error) {
        console.log(error);
        return Response.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
