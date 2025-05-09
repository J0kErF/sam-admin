import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (
  req: NextRequest,
  { params }: { params: { query: string } }
) => {
  try {
    await connectToDB();
    const query = decodeURIComponent(params.query);

    // تحقق إذا الـ query هو ObjectId صالح
    const isValidObjectId = mongoose.Types.ObjectId.isValid(query);

    const conditions: any[] = [
      { title: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
    ];

    // فقط أضف البحث بـ ObjectId إذا كانت query صالحة
    if (isValidObjectId) {
      conditions.push({ _id: new mongoose.Types.ObjectId(query) });
      conditions.push({ collections: new mongoose.Types.ObjectId(query) });
      conditions.push({ tags: new mongoose.Types.ObjectId(query) });
    }

    const searchedProducts = await Product.find({
      $or: conditions,
    });

    return NextResponse.json(searchedProducts, { status: 200 });
  } catch (err) {
    console.log("[search_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
