import { NextResponse } from "next/server";
import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/mongoDB";

export async function GET() {
  await connectToDB();

  const customers = await Customer.find({}).populate("orders");

  const leaderboard = customers
    .map((customer) => ({
      name: customer.name,
      email: customer.email,
      totalOrders: customer.orders.length,
    }))
    .sort((a, b) => b.totalOrders - a.totalOrders)
    .slice(0, 10);

  return NextResponse.json(leaderboard);
}
