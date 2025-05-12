"use client"

import ReportCard from "@/components/custom ui/ReportCard"
import ReportCardCustomer from "@/components/custom ui/ReportCardCustomer"
import LocationReportCard from "@/components/custom ui/LocationReportCard"
import { useEffect, useState } from "react"
import ProductsCard from "@/components/custom ui/ProductsCard"

const ReportsPage = () => {
  const [zeroStock, setZeroStock] = useState<any[]>([])
  const [lowStock, setLowStock] = useState<any[]>([])
  const [topUsed, setTopUsed] = useState<any[]>([])
  const [topCustomers, setTopCustomers] = useState<any[]>([])

  useEffect(() => {
    const fetchReports = async () => {
      const zero = await fetch("/api/reports/zero-stock").then(res => res.json())
      const low = await fetch("/api/reports/low-stock").then(res => res.json())
      const used = await fetch("/api/reports/top-used-items").then(res => res.json())
      const customers = await fetch("/api/reports/top-customers").then(res => res.json())

      setZeroStock(zero)
      setLowStock(low)
      setTopUsed(used)
      setTopCustomers(customers)
    }

    fetchReports()
  }, [])

  return (
    <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <LocationReportCard title="מיקומים" filename="locations" />
      <ProductsCard title="מוצרים" filename="products" />
      <ReportCard title="פריטים עם כמות 0" data={zeroStock} filename="zero-stock" />
      <ReportCard title="פריטים עם פחות מ־5 יחידות" data={lowStock} filename="low-stock" />
      <ReportCard title="הפריטים הכי בשימוש 30 יום אחרונים" data={topUsed} filename="top-used" />
      <ReportCardCustomer title="משתמשים עם הכי הרבה טיפןלים" data={topCustomers} filename="top-customers" />
    </div>
  )
}

export default ReportsPage
