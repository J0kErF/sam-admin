// /api/stats/top-stock/route.ts
import { connectToDB } from "@/lib/mongoDB";
import { Part } from "@/lib/models/Part";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();

    const parts = await Part.find();

    const withQuantities = parts.map((part: any) => {
      const totalQty = part.providers.reduce(
        (sum: number, p: any) => sum + (p.quantity || 0),
        0
      );
      return { name: part.name, quantity: totalQty };
    });

    const top5 = withQuantities
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return NextResponse.json(top5);
  } catch (error) {
    console.error("/api/stats/top-stock error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
