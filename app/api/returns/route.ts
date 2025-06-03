// File: /app/api/returns/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { ReturnRequest } from "@/lib/models/ReturnRequest";

export const dynamic = "force-dynamic"; // Ensures the route is always fresh
export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const returns = await ReturnRequest.find({}).populate("parts.partId");
    return NextResponse.json({ success: true, returns });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      providerName,
      contactName,
      status = "בהמתנה", // Default status
      parts,
      photos = []
    } = body;

    if (!providerName || !Array.isArray(parts) || parts.length === 0) {
      return NextResponse.json(
        { message: "Missing provider name or parts" },
        { status: 400 }
      );
    }

    await connectToDB();

    const newReturn = await ReturnRequest.create({
      providerName,
      contactName,
      status,
      parts,
      photos
    });

    return NextResponse.json({ success: true, returnRequest: newReturn }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating return request:", error);
    // Log the error for debugging
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: "Missing return request ID" }, { status: 400 });
    }

    await connectToDB();
    await ReturnRequest.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Return request deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, update } = body;

    if (!id || !update) {
      return NextResponse.json({ message: "Missing ID or update payload" }, { status: 400 });
    }

    await connectToDB();
    const updated = await ReturnRequest.findByIdAndUpdate(id, update, { new: true });
    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
