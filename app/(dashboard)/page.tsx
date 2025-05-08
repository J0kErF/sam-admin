"use client";

import SalesChart from "@/components/custom ui/SalesChart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getSalesPerMonth,
  getTotalCustomers,
  getTotalSales,
} from "@/lib/actions/actions";
import {
  CircleDollarSign,
  ShoppingBag,
  UserRound,
} from "lucide-react";

export default async function Home() {
  const totalRevenue = await getTotalSales().then((data) => data.totalRevenue);
  const totalOrders = await getTotalSales().then((data) => data.totalOrders);
  const totalCustomers = await getTotalCustomers();
  const graphData = await getSalesPerMonth();

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 w-full max-w-screen-2xl mx-auto rtl">
      <h1 className="text-2xl font-bold text-gray-800">דשבורד</h1>
      <Separator className="my-4 bg-gray-200" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-sm text-gray-600">הכנסות</CardTitle>
            <CircleDollarSign className="text-green-600 w-5 h-5" />
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-gray-900">₪ {totalRevenue}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-sm text-gray-600">כל הקניות</CardTitle>
            <ShoppingBag className="text-blue-600 w-5 h-5" />
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-gray-900">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-sm text-gray-600">משתמשים</CardTitle>
            <UserRound className="text-purple-600 w-5 h-5" />
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-gray-900">{totalCustomers}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-base font-medium text-gray-700">
            קניות ויזואליות (₪)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <SalesChart data={graphData} />
        </CardContent>
      </Card>
    </div>
  );
}
