import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { Part } from "@/lib/models/Part";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      sellPrice,
      modelYears,
      carCompanies,
      subMake,
      category,
      media = [],
      providers = [],
      companyBarcode = "", // ✅ extract the new field
    } = body;

    if (!name || !sellPrice || !category) {
      return NextResponse.json(
        { message: "Missing required fields: name, sellPrice, or category" },
        { status: 400 }
      );
    }

    if (!Array.isArray(providers) || providers.length === 0) {
      return NextResponse.json(
        { message: "At least one provider is required." },
        { status: 400 }
      );
    }

    await connectToDB();

    const cleanedProviders = providers.map((p) => ({
      providerName: p.providerName,
      price: parseFloat(p.price),
      barcode: p.barcode,
      quantity: isNaN(parseInt(p.quantity)) ? 0 : parseInt(p.quantity),
      location: p.location || "",
    }));

    const part = await Part.create({
      name,
      sellPrice: parseFloat(sellPrice),
      modelYears: modelYears.map((y: any) => parseInt(y)).filter((y: any) => !isNaN(y)),
      carCompanies,
      subMake,
      category,
      media,
      providers: cleanedProviders,
      companyBarcode, // ✅ add to creation
    });

    return NextResponse.json({ success: true, part }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error creating part:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
