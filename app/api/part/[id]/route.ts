import { connectToDB } from "@/lib/mongoDB";
import { Part } from "@/lib/models/Part";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ✅ GET part by ID
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const part = await Part.findById(params.id);
    if (!part) {
      return NextResponse.json({ message: "Part not found" }, { status: 404 });
    }
    return NextResponse.json(part);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ✅ PUT update part
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const body = await req.json();

    // Ensure isOnSite is present, default to false if missing
    const updateData = {
      ...body,
      isOnsite: typeof body.isOnsite === "boolean" ? body.isOnsite : false,
    };

    const updatedPart = await Part.findByIdAndUpdate(params.id, updateData, { new: true });

    if (!updatedPart) {
      return NextResponse.json({ message: "Part not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPart);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ✅ DELETE part by ID
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const deleted = await Part.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ message: "Part not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Part deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
