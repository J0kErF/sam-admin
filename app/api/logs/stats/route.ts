// /app/api/logs/stats/route.ts

import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Log from "@/lib/models/log"; // assuming your log model is named Log

export const GET = async () => {
  try {
    await connectToDB();

    const stats = await Log.aggregate([
      {
        $group: {
          _id: "$reason",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          reason: "$_id",
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("[logs/stats_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
