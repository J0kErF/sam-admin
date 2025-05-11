import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim() || "";

    const regex = new RegExp(query, "i");

    const filters: any[] = [
      { title: { $regex: regex } },
      { location: { $regex: regex } },
    ];

    // Add _id only if valid
    if (mongoose.Types.ObjectId.isValid(query)) {
      filters.push({ _id: new mongoose.Types.ObjectId(query) });
    }

    const products = await Product.find(query ? { $or: filters } : {}).lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error("[STOCK_PRODUCTS_GET]", error);
    return new NextResponse("Failed to fetch products", { status: 500 });
  }
}
