import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { query: string } }
) => {
  try {
    await connectToDB();

    const query = params.query.trim();

    // If query is empty, return early
    if (!query) {
      return NextResponse.json([], { status: 200 });
    }

    const searchedProducts = await Product.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(30); // You can increase this or add pagination later

    return NextResponse.json(searchedProducts, { status: 200 });
  } catch (err) {
    console.error("[search_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
