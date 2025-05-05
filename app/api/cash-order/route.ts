import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Order from "@/lib/models/Order";
import Customer from "@/lib/models/Customer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // or use http://localhost:3001 to be more strict
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// For preflight checks (OPTIONS)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// POST handler for cash orders
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      clerkId,
      customerDetails,
      shippingDetails,
      orderItems,
      totalAmount,
    } = body;

    await connectToDB();

    const newOrder = new Order({
      customerClerkId: clerkId,
      products: orderItems,
      shippingAddress: shippingDetails,
      shippingRate: "cash-on-delivery",
      totalAmount,
      paymentMethod: "cash",
      paymentStatus: "pending",
    });

    await newOrder.save();

    let customer = await Customer.findOne({ clerkId });

    if (customer) {
      customer.orders.push(newOrder._id);
    } else {
      customer = new Customer({
        clerkId,
        name: customerDetails.name,
        email: customerDetails.email,
        orders: [newOrder._id],
      });
    }

    await customer.save();

    return new NextResponse("Cash order created", {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("[cash-order_POST]", err);
    return new NextResponse("Failed to create cash order", {
      status: 500,
      headers: corsHeaders,
    });
  }
}
