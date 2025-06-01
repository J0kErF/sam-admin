"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Truck, ListOrdered, Folder } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    orders: 0,
    parts: 0,
    providers: 0,
    categories: 0,
  });
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [topReceived, setTopReceived] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          ordersRes,
          partsRes,
          providersRes,
          categoriesRes,
          topReceivedRes,
          lowStockRes,
        ] = await Promise.all([
          fetch("/api/order"),
          fetch("/api/part"),
          fetch("/api/providers"),
          fetch("/api/categories"),
          fetch("/api/stats/top-received-parts"),
          fetch("/api/stats/low-stock"),
        ]);

        const [
          orders,
          parts,
          providers,
          categories,
          topReceivedData,
          lowStockData,
        ] = await Promise.all([
          ordersRes.json(),
          partsRes.json(),
          providersRes.json(),
          categoriesRes.json(),
          topReceivedRes.json(),
          lowStockRes.json(),
        ]);

        setStats({
          orders: orders.length || 0,
          parts: parts.length || 0,
          providers: providers.providers?.length || 0,
          categories: categories.categories?.length || 0,
        });

        setTopReceived(topReceivedData || []);
        setLowStock(lowStockData || []);

      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📊 דאשבורד</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard title="הזמנות" icon={<ShoppingBag />} value={stats.orders} color="text-blue-700" href="/V2/orders" />
        <StatCard title="חלקים" icon={<ListOrdered />} value={stats.parts} color="text-green-600" href="/V2/parts" />
        <StatCard title="ספקים" icon={<Truck />} value={stats.providers} color="text-yellow-600" href="/V2/providers" />
        <StatCard title="קטגוריות" icon={<Folder />} value={stats.categories} color="text-purple-600" href="/V2/category" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* חלקים שהוזמנו הכי הרבה */}
        <div className="bg-white rounded-xl p-4 shadow w-full">
          <h2 className="text-lg font-semibold mb-4">📦 חלקים שהוזמנו הכי הרבה</h2>

          {topReceived.length === 0 ? (
            <p className="text-gray-500 text-center">אין מידע להצגה.</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-600 border-b">
                    <th className="p-2">שם החלק</th>
                    <th className="p-2">מספר הכנסות למערכת</th>
                  </tr>
                </thead>
                <tbody>
                  {topReceived.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b hover:bg-gray-100 cursor-pointer"
                      onClick={() => router.push(`/V2/parts/${item.partId}`)}
                    >
                      <td className="p-2 font-medium text-blue-700 underline">{item.name}</td>
                      <td className="p-2">{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* כמויות קטנות */}
        <div className="bg-white rounded-xl p-4 shadow w-full">
          <h2 className="text-lg font-semibold mb-4">🟥 כמויות קטנות (0–3)</h2>

          {lowStock.length === 0 ? (
            <p className="text-gray-500 text-center">אין חלקים עם כמות נמוכה.</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-600 border-b">
                    <th className="p-2">שם החלק</th>
                    <th className="p-2">כמות</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((part, idx) => (
                    <tr
                      key={idx}
                      className="border-b hover:bg-gray-100 cursor-pointer"
                      onClick={() => router.push(`/V2/parts/${part._id}`)}
                    >
                      <td className="p-2 font-medium text-blue-700 underline">{part.name}</td>
                      <td className="p-2">{part.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
          
    </div>
  );
}

function StatCard({
  title,
  icon,
  value,
  color,
  href,
}: {
  title: string;
  icon: React.ReactNode;
  value: number;
  color: string;
  href: string;
}) {
  const router = useRouter();
  return (
    <Card
      className="hover:shadow-lg transition cursor-pointer"
      onClick={() => router.push(href)}
    >
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-semibold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
