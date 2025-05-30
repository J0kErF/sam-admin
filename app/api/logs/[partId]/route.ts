import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { PartLog } from "@/lib/models/PartLog";

export const dynamic = "force-dynamic";

// ✅ GET logs for a specific part ID
export async function GET(
  _req: NextRequest,
  context: { params: { partId: string } }
) {
  try {
    const partId = context.params.partId;

    await connectToDB();

    const logs = await PartLog.find({ partId })
      .sort({ createdAt: -1 })
      .lean()
      .select("createdAt reason updates");

    const formattedLogs = logs.map((log: any) => ({
      timestamp: log.createdAt,
      reason: log.reason,
      updates: log.updates || [],
    }));

    return NextResponse.json(formattedLogs);
  } catch (error: any) {
    console.error("❌ Error fetching logs:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
export async function POST(req: NextRequest, context: { params: { partId: string } }) {
  try {
    const partId = context.params.partId;
    const body = await req.json();
    const { reason, updates } = body;

    // Validate input
    if (!reason || !Array.isArray(updates)) {
      return NextResponse.json(
        { message: "Missing 'reason' or 'updates' (array) in request body" },
        { status: 400 }
      );
    }

    // Validate update entry format
    const invalidUpdate = updates.find((u) => !u.field);
    if (invalidUpdate) {
      return NextResponse.json(
        { message: "Each update must include a 'field'" },
        { status: 400 }
      );
    }

    await connectToDB();

    const logEntry = await PartLog.create({
      partId,
      reason,
      updates,
    });

    return NextResponse.json({ message: "✅ Log saved successfully", log: logEntry });
  } catch (error: any) {
    console.error("❌ Error saving log:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
