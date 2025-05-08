// ✅ This is a Server Component – do NOT use "use client"

import SalesChart from "@/components/custom ui/SalesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getSalesPerMonth,
  getTotalCustomers,
  getTotalSales,
} from "@/lib/actions/actions";
import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";

export default async function Home() {
  const { totalRevenue, totalOrders } = await getTotalSales();
  const totalCustomers = await getTotalCustomers();
  const graphData = await getSalesPerMonth();

  return (
    <div className="px-4 sm:px-6 md:px-10 py-10">
      <p className="text-heading2-bold text-right">דשבורד</p>
      <Separator className="bg-grey-1 my-5" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>הכנסות</CardTitle>
            <CircleDollarSign className="hidden sm:block" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold text-lg">${totalRevenue}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>כל הקניות</CardTitle>
            <ShoppingBag className="hidden sm:block" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold text-lg">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>משתמשים</CardTitle>
            <UserRound className="hidden sm:block" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold text-lg">{totalCustomers}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>קניות ויזואליות (₪)</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={graphData} />
        </CardContent>
      </Card>
    </div>
  );
}
