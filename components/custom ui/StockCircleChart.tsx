"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3B82F6", "#E5E7EB"]; // Blue and gray

export default function StockCircleChart({ used, total }: { used: number; total: number }) {
  const remaining = total - used;
  const data = [
    { name: "Used", value: used },
    { name: "Available", value: remaining > 0 ? remaining : 0 },
  ];

  return (
    <div className="w-full h-[260px] flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute text-center mt-[-140px]">
        <p className="text-2xl font-bold text-blue-600">
          {Math.round((used / total) * 100)}%
        </p>
        <p className="text-xs text-gray-500">תפוסה</p>
      </div>
    </div>
  );
}
