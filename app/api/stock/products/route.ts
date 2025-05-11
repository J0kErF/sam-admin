// File: app/api/stock/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("_id");
    const title = searchParams.get("title");
    const location = searchParams.get("location");

    let query = {};

    if (id) {
      query = { _id: { $regex: id, $options: "i" } }; 
    } else if (title) {
      query = { title: { $regex: title, $options: "i" } };
    } else if (location) {
      query = { location: { $regex: location, $options: "i" } };
    }

    const products = Object.keys(query).length
      ? await Product.find(query)
      : await Product.find({}); // fallback to all if no param

    return NextResponse.json(products);
  } catch (error) {
    console.error("[GET_PRODUCTS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
