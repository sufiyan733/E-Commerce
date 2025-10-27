import mongoose from "mongoose";

const dburl = process.env.DATABASE_URL;

if (!dburl) {
  throw new Error("Please define the DATABASE_URL environment variable in .env");
}

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(dburl);
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed", err);
    throw err;
  }
}
