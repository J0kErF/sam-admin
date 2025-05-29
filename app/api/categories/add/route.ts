// app/api/categories/add/route.ts (for Next.js 13+/App Router)

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { Category } from "@/lib/models/Category";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "Category name is required" }, { status: 400 });
    }

    await connectToDB();

    const category = await Category.create({ name });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
