// app/api/providers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { Provider } from "@/lib/models/Provider";
export const dynamic = "force-dynamic";
// GET all providers
export async function GET() {
  try {
    await connectToDB();
    const providers = await Provider.find();
    return NextResponse.json({ providers });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE a provider by ID from request body
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Missing provider ID" }, { status: 400 });
    }

    await connectToDB();
    await Provider.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
