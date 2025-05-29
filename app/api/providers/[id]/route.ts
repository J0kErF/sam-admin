import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { Provider } from "@/lib/models/Provider";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const updateData = await req.json();

    await connectToDB();
    const provider = await Provider.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json({ provider });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
