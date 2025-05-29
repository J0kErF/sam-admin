// /api/stock/search/[query]/route.ts
import { connectToDB } from "@/lib/mongoDB";
import { Part } from "@/lib/models/Part";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (
  _req: NextRequest,
  { params }: { params: { query: string } }
) => {
  try {
    await connectToDB();
    const query = decodeURIComponent(params.query).trim();

    const isValidObjectId = mongoose.Types.ObjectId.isValid(query);

    const matchConditions: any[] = [
      { name: { $regex: query, $options: "i" } },
      { "providers.barcode": { $regex: query, $options: "i" } },
      { "providers.location": { $regex: query, $options: "i" } },
    ];

    if (isValidObjectId) {
      matchConditions.push({ _id: new mongoose.Types.ObjectId(query) });
    }

    const parts = await Part.find({ $or: matchConditions });

    // Keep only the matching providers in the result
    const matchedParts = parts.map((part: any) => {
      const matchedProviders = part.providers.filter(
        (p: any) =>
          p.barcode?.toLowerCase().includes(query.toLowerCase()) ||
          p.location?.toLowerCase().includes(query.toLowerCase())
      );

      return {
        _id: part._id,
        name: part.name,
        category: part.category,
        media: part.media,
        providers: matchedProviders.length > 0 ? matchedProviders : part.providers,
      };
    });

    return NextResponse.json(matchedParts);
  } catch (error) {
    console.error("❌ /api/stock/search error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
