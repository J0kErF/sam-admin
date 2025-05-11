// File: app/api/stock/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    const regexQuery = new RegExp(query, "i");

    const filter = query
      ? {
          $or: [
            { _id: { $regex: regexQuery } }, // treat ID as string for partial match
            { title: { $regex: regexQuery } },
            { location: { $regex: regexQuery } },
          ],
        }
      : {};

    const products = await Product.find(filter);

    return NextResponse.json(products);
  } catch (error) {
    console.error("[STOCK_PRODUCTS_GET]", error);
    return new NextResponse("Failed to fetch products", { status: 500 });
  }
}
