import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { Part } from "@/lib/models/Part";

export const dynamic = "force-dynamic";

// ✅ GET all parts
export async function GET() {
  try {
    await connectToDB();
    const parts = await Part.find().lean(); // lean for faster read-only queries
    return NextResponse.json(parts, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching parts:", error);
    return NextResponse.json({ message: "Failed to fetch parts", error: error.message }, { status: 500 });
  }
}
