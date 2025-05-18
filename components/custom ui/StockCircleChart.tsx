"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3B82F6", "#E5E7EB"]; // Blue (used), Gray (remaining)

export default function StockCircleChart({ used, total }: { used: number; total: number }) {
  const remaining = Math.max(total - used, 0);
  const percentage = total === 0 ? 0 : Math.round((used / total) * 100);

  const data = [
    { name: "נבדקו", value: used },
    { name: "טרם נבדקו", value: remaining },
  ];

  return (
    <div className="relative w-full h-[260px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [`${value}`, name]}
            labelStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Centered Percentage Label */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center rtl:text-right">
        <p className="text-2xl font-bold text-blue-600">{percentage}%</p>
        <p className="text-sm text-gray-600">תפוסה</p>
      </div>
    </div>
  );
}
