import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");

    const query = location
      ? { location: { $regex: location, $options: "i" } }
      : {}; // If no location is provided, fetch all products

    const products = await Product.find(query);

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("[GET_PRODUCTS_BY_LOCATION]", error);
    return new NextResponse("Error fetching products", { status: 500 });
  }
}
