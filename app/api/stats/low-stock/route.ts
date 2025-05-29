// /api/stats/low-stock/route.ts
import { connectToDB } from "@/lib/mongoDB";
import { Part } from "@/lib/models/Part";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();

    const parts = await Part.find();

    const lowStockParts = parts
      .map((part: any) => {
        const totalQty = part.providers.reduce(
          (sum: number, p: any) => sum + (p.quantity || 0),
          0
        );
        return {
          _id: part._id, // ✅ include ID
          name: part.name,
          quantity: totalQty,
        };
      })
      .filter((p) => p.quantity <= 3);

    return NextResponse.json(lowStockParts);
  } catch (error) {
    console.error("/api/stats/low-stock error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
