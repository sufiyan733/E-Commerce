import { log } from "node:console";
import ProductGrid from "./prodCard";

export default async function Products() {
  try {
      const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/products`, { cache: "no-store" });
   
    
    const products =await res.json();

    return <ProductGrid products={products} />;
  } catch (error) {
    console.log(error);
    
  }
}
