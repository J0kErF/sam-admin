import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Log from "@/lib/models/log"; // create this model below

export async function POST(req: Request) {
  await connectToDB();
  const body = await req.json();
  await Log.create(body);
  return NextResponse.json({ success: true });
}
