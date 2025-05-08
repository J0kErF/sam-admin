import { NextResponse } from "next/server";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";

export async function GET() {
  await connectToDB();
  const lowStockItems = await Product.find({ quantity: { $lt: 5, $gt: 0 } });
  return NextResponse.json(lowStockItems);
}

