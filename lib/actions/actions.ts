import Customer from "../models/Customer";
import Order from "../models/Order";
import { connectToDB } from "../mongoDB"
import Product from "@/lib/models/Product";
import StockLog from "@/lib/models/StockLog";



export const getSearchedProducts = async (query: string) => {
  try {
    const res = await fetch(`${process.env.ADMIN_DASHBOARD_URL}/api/search/${query}`, {
      cache: "no-store"
    });

    if (!res.ok) throw new Error("Failed to fetch");

    return await res.json();
  } catch (err) {
    console.error("[getSearchedProducts]", err);
    return [];
  }
};


export const getTotalSales = async () => {
  await connectToDB();
  const orders = await Order.find()
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0)
  return { totalOrders, totalRevenue }
}

export const getTotalCustomers = async () => {
  await connectToDB();
  const customers = await Customer.find()
  const totalCustomers = customers.length
  return totalCustomers
}

export const getSalesPerMonth = async () => {
  await connectToDB()
  const orders = await Order.find()

  const salesPerMonth = orders.reduce((acc, order) => {
    const monthIndex = new Date(order.createdAt).getMonth(); // 0 for Janruary --> 11 for December
    acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;
    // For June
    // acc[5] = (acc[5] || 0) + order.totalAmount (orders have monthIndex 5)
    return acc
  }, {})

  const graphData = Array.from({ length: 12 }, (_, i) => {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(0, i))
    // if i === 5 => month = "Jun"
    return { name: month, sales: salesPerMonth[i] || 0 }
  })

  return graphData
}

export const getStockCount = async () => {
  await connectToDB()
  const products = await Product.find();
  const total = products.length;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const logs = await StockLog.find({
    lastCountedAt: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
  }).lean();
  const used = logs.length;
  return { used, total };
}