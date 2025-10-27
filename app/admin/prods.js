

export default async function Products() {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/products`, { cache: "no-store" });
    const products = await res.json();

    return products;
}
