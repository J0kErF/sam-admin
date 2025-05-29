// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { Category } from "@/lib/models/Category";

// GET: Get all categories
export async function GET() {
  try {
    await connectToDB();
    const categories = await Category.find();
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE: Delete a category by ID
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ message: "Category ID is required" }, { status: 400 });

    await connectToDB();
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";