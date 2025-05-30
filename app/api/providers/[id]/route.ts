import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { Provider } from "@/lib/models/Provider";

// PUT /api/providers/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const {
      companyName,
      address,
      phoneNumber,
      email,
      contactName,
      notes,
      licenseNumber,
      bankTransferDetails,
    } = await req.json();

    await connectToDB();

    const updatedProvider = await Provider.findByIdAndUpdate(
      id,
      {
        companyName,
        address,
        phoneNumber,
        email,
        contactName,
        notes,
        licenseNumber,
        bankTransferDetails,
      },
      { new: true }
    );

    if (!updatedProvider) {
      return NextResponse.json({ message: "Provider not found" }, { status: 404 });
    }

    return NextResponse.json({ provider: updatedProvider });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
export const dynamic = "force-dynamic"; // Ensures the route is always fresh