import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { Provider } from "@/lib/models/Provider";

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
    });

    return NextResponse.json({ success: true, provider }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error creating provider:", error); // 🔍 add this
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
