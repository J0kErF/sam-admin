// /api/returns/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { ReturnRequest } from "@/lib/models/ReturnRequest";
export const dynamic = "force-dynamic"; // Ensures the route is always fresh
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { id } = params;

    await connectToDB();
    const updated = await ReturnRequest.findByIdAndUpdate(id, body, { new: true });

    if (!updated) return NextResponse.json({ message: "Return not found" }, { status: 404 });

    return NextResponse.json({ success: true, updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await connectToDB();

    const deleted = await ReturnRequest.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const found = await ReturnRequest.findById(params.id).lean();

    if (!found) return NextResponse.json({ success: false, message: "Return not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: found }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
