import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB"; // make sure this connects to MongoDB
import { Part } from "@/lib/models/Part"; // path to your Part model

export const GET = async () => {
  try {
    await connectToDB();

    const parts = await Part.find();

    let totalWorth = 0;

    for (const part of parts) {
      for (const provider of part.providers) {
        totalWorth += provider.price * provider.quantity;
      }
    }

    return NextResponse.json({
      success: true,
      totalWorth,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
