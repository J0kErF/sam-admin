import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { Provider } from "@/lib/models/Provider";

export const dynamic = "force-dynamic";

// ✅ GET all providers
export async function GET() {
  try {
    await connectToDB();
    const providers = await Provider.find();
    return NextResponse.json({ providers });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ✅ DELETE a provider by ID from request body
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Missing provider ID" }, { status: 400 });
    }

    await connectToDB();
    const deleted = await Provider.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Provider not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyName,
      address = "",
      phoneNumber = "",
      email = "",
      contactName = "",
      notes = "",
      licenseNumber = "",
      bankTransferDetails = "",
    } = body;

    if (!companyName) {
      return NextResponse.json({ message: "Company name is required" }, { status: 400 });
    }

    await connectToDB();

    const provider = await Provider.create({
      companyName,
      address,
      phoneNumber,
      email,
      contactName,
      notes,
      licenseNumber,
      bankTransferDetails,
    });

    return NextResponse.json({ success: true, provider }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error creating provider:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}