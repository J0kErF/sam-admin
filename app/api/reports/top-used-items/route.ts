import { NextResponse } from "next/server";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";

export async function GET() {
  await connectToDB();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const orders = await Order.find({ createdAt: { $gte: thirtyDaysAgo } });

  const itemMap: Record<string, number> = {};
  for (const order of orders) {
    for (const item of order.products) {
      const id = item.product.toString();
      itemMap[id] = (itemMap[id] || 0) + item.quantity;
    }
  }

  const sortedItems = Object.entries(itemMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const productIds = sortedItems.map(([id]) => id);
  const products = await Product.find({ _id: { $in: productIds } });

  const result = products.map((product) => ({
    ...product.toObject(),
    quantity: itemMap[product._id.toString()] || 0,
  }));

  return NextResponse.json(result);
}
