import { connectToDB } from "@/lib/mongoDB";
import { PartLog } from "@/lib/models/PartLog";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();

  try {
    const result = await PartLog.aggregate([
      {
        $match: {
          reason: "יחידות שהתקבלו",
        },
      },
      {
        $group: {
          _id: "$partId",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "parts",
          localField: "_id",
          foreignField: "_id",
          as: "part",
        },
      },
      {
        $unwind: "$part",
      },
      {
        $project: {
          partId: { $toString: "$_id" }, // Ensure string
          name: "$part.name",
          count: 1,
          _id: 0,
        },
      },
    ]);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Error in /api/stats/top-received-parts:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic"; // Ensure this route is always fresh