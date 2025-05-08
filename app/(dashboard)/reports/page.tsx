"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ReportsPage = () => {
  const [zeroStock, setZeroStock] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [topUsedItems, setTopUsedItems] = useState([])
  const [topCustomers, setTopCustomers] = useState([])

  useEffect(() => {
    fetch("/api/reports/zero-stock").then(res => res.json()).then(setZeroStock)
    fetch("/api/reports/low-stock").then(res => res.json()).then(setLowStock)
    fetch("/api/reports/top-used-items").then(res => res.json()).then(setTopUsedItems)
    fetch("/api/reports/top-customers").then(res => res.json()).then(setTopCustomers)
  }, [])

  const downloadAsJSON = (data: any[], filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
  }

  return (
    <div className="p-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>פריטים עם כמות 0</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => downloadAsJSON(zeroStock, "zero-stock.json")}>הורד</Button>
          <p className="text-sm text-gray-500 mt-2">סהכ: {zeroStock.length} פריטים</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>פריטים עם פחות מ-5 יחידות</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => downloadAsJSON(lowStock, "low-stock.json")}>הורד</Button>
          <p className="text-sm text-gray-500 mt-2">סהכ: {lowStock.length} פריטים</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>10 הפריטים הכי בשימוש ב-30 הימים האחרונים</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-sm">
            {topUsedItems.map((item: any, index: number) => (
              <li key={index}>{item.title} - {item.usageCount} פעמים</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>לוח מובילים של לקוחות לפי הזמנות</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-decimal pl-5 text-sm">
            {topCustomers.map((customer: any, index: number) => (
              <li key={index}>{customer.name} - {customer.orderCount} הזמנות</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default ReportsPage
