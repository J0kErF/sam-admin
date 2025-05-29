
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSalesPerMonth, getTotalCustomers, getTotalSales } from "@/lib/actions/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SearchBar from "@/components/custom ui/SearchBar";
import StockCircleChart from "@/components/custom ui/StockCircleChart";
import { getStockCount } from "@/lib/actions/actions"; // adjust to your logic


export default async function Dashboard() {
  const { totalRevenue, totalOrders } = await getTotalSales();
  const totalCustomers = await getTotalCustomers();
  const { used, total } = await getStockCount(); // ✅ add this line


  return (
    <div className="p-4 md:p-10 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-right mb-4">דשבורד</h1>
      <SearchBar />

      <Separator className="my-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>הכנסות</CardTitle>
            <CircleDollarSign />
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">${totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>כל הטיפולים</CardTitle>
            <ShoppingBag />
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>משתמשים</CardTitle>
            <UserRound />
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{totalCustomers}</p>
          </CardContent>
        </Card>
      </div>

      

      <Card className="mt-10">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-semibold text-blue-900">סטטוס מחסן</CardTitle>
        </CardHeader>

        <CardContent className="flex justify-center items-center">
          <div className="w-full max-w-xs">
            
            <StockCircleChart used={used} total={total} />
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
export const dynamic = "force-dynamic";
