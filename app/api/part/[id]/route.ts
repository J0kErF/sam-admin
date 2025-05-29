import { connectToDB } from "@/lib/mongoDB";
import { Part } from "@/lib/models/Part";
import { NextRequest, NextResponse } from "next/server";

// GET single part
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await connectToDB();
  const part = await Part.findById(params.id);
  if (!part) return NextResponse.json({ message: "Part not found" }, { status: 404 });
  return NextResponse.json(part);
}

// PUT update part
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDB();
  const data = await req.json();
  const updated = await Part.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json(updated);
}

// DELETE part
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await connectToDB();
  await Part.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Part deleted" });
}
export const dynamic = "force-dynamic";