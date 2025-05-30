import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TopReceivedPartsCard() {
  const [topReceivedParts, setTopReceivedParts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchTopParts() {
      try {
        const res = await fetch("/api/stats/top-received-parts");
        const data = await res.json();
        setTopReceivedParts(data);
      } catch (err) {
        console.error("Failed to fetch top received parts", err);
      }
    }
    fetchTopParts();
  }, []);

  return (
    <Card className="hover:shadow-lg transition cursor-pointer">
      <CardHeader>
        <CardTitle className="text-lg">🔝 5 חלקים שהתקבלו הכי הרבה</CardTitle>
      </CardHeader>
      <CardContent>
        {topReceivedParts.length === 0 ? (
          <p className="text-sm text-gray-500">לא נמצאו נתונים</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={topReceivedParts}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip formatter={(val: any) => [`${val} עדכונים`, "כמות"]} />
              <Bar dataKey="count" fill="#4F46E5">
                {topReceivedParts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill="#4F46E5"
                    cursor="pointer"
                    onClick={() => router.push(`/V2/parts/${entry._id}`)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
