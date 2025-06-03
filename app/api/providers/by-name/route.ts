// /api/providers/by-name/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { Provider } from "@/lib/models/Provider";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json({ message: "Provider name is required" }, { status: 400 });
    }

    await connectToDB();

    const provider = await Provider.findOne({ companyName: name });

    if (!provider) {
      return NextResponse.json({ message: "Provider not found" }, { status: 404 });
    }

    return NextResponse.json({ provider }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
