// app/V2/dashboard/page.tsx

"use client";

import Link from "next/link";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  export default function DashboardPage() {
    const [stats, setStats] = useState({
      orders: 0,
      parts: 0,
      providers: 0,
      categories: 0,
    });
    const [logStats, setLogStats] = useState<any[]>([]);
    const [lowStock, setLowStock] = useState<any[]>([]);
    const [topStock, setTopStock] = useState<any[]>([]);

    const router = useRouter();

    useEffect(() => {
      async function fetchStats() {
        try {
          const [ordersRes, partsRes, providersRes, categoriesRes, logsRes, lowRes, topRes] =
            await Promise.all([
              fetch("/api/order"),
              fetch("/api/part"),
              fetch("/api/providers"),
              fetch("/api/categories"),
              fetch("/api/logs/stats"),
              fetch("/api/stats/low-stock"),
              fetch("/api/stats/top-stock"),
            ]);

          const [orders, parts, providers, categories, logs, low, top] = await Promise.all([
            ordersRes.json(),
            partsRes.json(),
            providersRes.json(),
            categoriesRes.json(),
            logsRes.json(),
            lowRes.json(),
            topRes.json(),
          ]);

          setStats({
            orders: orders.length || 0,
            parts: parts.length || 0,
            providers: providers.providers?.length || 0,
            categories: categories.categories?.length || 0,
          });
          setLogStats(logs);
          setLowStock(low);
          setTopStock(top);
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
          <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => router.push("/V2/orders")}>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>הזמנות</CardTitle>
              <ShoppingBag />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-blue-700">{stats.orders}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => router.push("/V2/parts")}>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>חלקים</CardTitle>
              <ListOrdered />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-green-600">{stats.parts}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => router.push("/V2/providers")}>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>ספקים</CardTitle>
              <Truck />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-yellow-600">{stats.providers}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => router.push("/V2/categories")}>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>קטגוריות</CardTitle>
              <Folder />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-purple-600">{stats.categories}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">📊 שינויים סטטיסטקות</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={logStats}>
                <XAxis dataKey="reason" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">🟩 5 פריטים עם הכמות הכי גדולה</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={topStock}
                  dataKey="quantity"
                  nameKey="name"
                  outerRadius={100}
                  label={({ name }) => name}
                  onClick={(data) => router.push(`/V2/parts/${data.payload._id}`)}
                >
                  {topStock.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-4 shadow col-span-full">
            <h2 className="text-lg font-semibold mb-4">🟥כמויות קטנות (0–3)</h2>
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-600 border-b">
                    <th className="p-2">פריט</th>
                    <th className="p-2">כמות</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((part, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-100 cursor-pointer" onClick={() => router.push(`/V2/parts/${part._id}`)}>
                      <td className="p-2 font-medium text-blue-700 underline">{part.name}</td>
                      <td className="p-2">{part.quantity}</td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    );
  }
