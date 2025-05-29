import { connectToDB } from "@/lib/mongoDB";
import { Part } from "@/lib/models/Part";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (
  req: NextRequest,
  { params }: { params: { query: string } }
) => {
  try {
    await connectToDB();
    const query = decodeURIComponent(params.query);

    const isValidObjectId = mongoose.Types.ObjectId.isValid(query);

    const conditions: any[] = [
      { name: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
      { subMake: { $regex: query, $options: "i" } },
      { carCompanies: { $regex: query, $options: "i" } },
      { "providers.barcode": { $regex: query, $options: "i" } },
      { "providers.providerName": { $regex: query, $options: "i" } },
    ];

    if (isValidObjectId) {
      conditions.push({ _id: new mongoose.Types.ObjectId(query) });
    }

    const parts = await Part.find({ $or: conditions });

    return NextResponse.json(parts, { status: 200 });
  } catch (err) {
    console.error("[parts_search_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
