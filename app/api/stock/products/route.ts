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

    let products;

    if (!query) {
      // Return all products if no query is given
      products = await Product.find({});
    } else {
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(query);

      const filter = {
        $or: [
          ...(isValidObjectId ? [{ _id: query }] : []),
          { title: { $regex: query, $options: "i" } },
          { location: { $regex: query, $options: "i" } },
        ],
      };

      products = await Product.find(filter);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("[STOCK_PRODUCTS_GET]", error);
    return new NextResponse("Failed to fetch products", { status: 500 });
  }
}
