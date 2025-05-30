import { connectToDB } from "@/lib/mongoDB";
import { Part } from "@/lib/models/Part";
import { NextRequest, NextResponse } from "next/server";

import { PartLog } from "@/lib/models/PartLog";

export const dynamic = "force-dynamic";

// ✅ GET single part by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await connectToDB();

    const part = await Part.findById(id);
    if (!part) {
      return NextResponse.json({ message: "Part not found" }, { status: 404 });
    }

    return NextResponse.json(part);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDB();
  const data = await req.json();
  const updated = await Part.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json(updated);
}

// ✅ DELETE part by ID
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const deleted = await Part.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ message: "Part not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Part deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
