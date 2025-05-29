// /app/api/stock/logs/route.ts

import { connectToDB } from "@/lib/mongoDB";
import Log from "@/lib/models/log"; // ודא שזה הנתיב הנכון לקובץ המודל
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();

    const logs = await Log.aggregate([
      { $match: { reason: "ספירת מלאי" } },
      {
        $group: {
          _id: "$partId",
          latest: { $max: "$timestamp" },
        },
      },
    ]);

    const result: { [key: string]: string } = {};
    logs.forEach((log: any) => {
      result[log._id] = log.latest;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching stock logs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
