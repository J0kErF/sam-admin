import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { Part } from "@/lib/models/Part";

export async function GET() {
  try {
    await connectToDB();
    const parts = await Part.find();
    return NextResponse.json(parts);
  } catch (error: any) {
    console.error("❌ Error fetching parts:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
