// Route handler - GET all products by location (e.g., /api/location/[location])

import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { location: string } }) {
  try {
    await connectToDB();
    const location = decodeURIComponent(params.location);

    const products = await Product.find({ location: { $regex: location, $options: "i" } });
    return NextResponse.json(products);
  } catch (error) {
    console.error("[location_GET]", error);
    return new NextResponse("Error fetching products by location", { status: 500 });
  }
}
