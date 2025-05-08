import { NextResponse } from "next/server";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";

export async function GET() {
  await connectToDB();
  const zeroStockItems = await Product.find({ quantity: { $lte: 0 } });
  return NextResponse.json(zeroStockItems);
}