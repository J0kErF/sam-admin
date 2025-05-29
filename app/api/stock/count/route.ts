// File: app/api/stock/count/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import StockLog from "@/lib/models/StockLog";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { productId, date } = await req.json();

    if (!productId) {
      return new NextResponse("Missing productId", { status: 400 });
    }

    const lastCountedAt = date ? new Date(date) : new Date();

    await StockLog.findOneAndUpdate(
      { productId },
      { productId, lastCountedAt },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "Stock count updated successfully" });
  } catch (err) {
    console.error("[STOCK_COUNT_POST]", err);
    return new NextResponse("Failed to update stock count", { status: 500 });
  }
}