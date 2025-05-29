// app/V2/stock-check/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function StockCheckPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [logTimes, setLogTimes] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const router = useRouter();

  const getLogColor = (timestamp: string) => {
    const daysDiff = (new Date().getTime() - new Date(timestamp).getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 30 ? "text-green-600" : "text-red-600";
  };

  const fetchDefaultData = async () => {
    setLoading(true);
    try {
      const [partsRes, logRes] = await Promise.all([
        fetch("/api/part"),
        fetch("/api/stock/logs")
      ]);
      const [partsData, logData] = await Promise.all([
        partsRes.json(),
        logRes.json()
      ]);

      const sortedParts = partsData.sort((a: any, b: any) => {
        const timeA = new Date(logData[a._id] || 0).getTime();
        const timeB = new Date(logData[b._id] || 0).getTime();
        return timeA - timeB;
      });

      setResults(sortedParts);
      setLogTimes(logData);
    } catch (err) {
      console.error("Failed to load default stock data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      fetchDefaultData();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/stock/search/${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data);

      const logRes = await fetch(`/api/stock/logs`);
      const logData = await logRes.json();
      setLogTimes(logData);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefaultData();
  }, []);

  useEffect(() => {
    if (!scannerOpen) return;

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      disableFlip: true,
      aspectRatio: 1,
      showTorchButtonIfSupported: true
    }, /* verbose= */ false);

    scanner.render(
      (decodedText) => {
        setScannerOpen(false);
        setQuery(decodedText);
        handleSearchChange(decodedText);
        scanner.clear();
      },
      (error) => {
        console.error("QR Scan Error:", error);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scannerOpen]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-right mb-6">🔎 בדיקת מלאי</h1>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="סרוק ברקוד או הכנס מיקום"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full"
        />
        <button
          onClick={() => setScannerOpen(!scannerOpen)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📷 סרוק QR
        </button>
      </div>

      {scannerOpen && (
        <div className="mb-6 p-4 border border-blue-300 rounded-lg shadow-inner bg-white">
          <div id="qr-reader" className="w-full" />
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-center">...טוען תוצאות</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500 text-center">אין תוצאות</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((part) => (
            <Card
              key={part._id}
              onClick={() => router.push(`/V2/parts/${part._id}`)}
              className="hover:shadow-md cursor-pointer"
            >
              <CardHeader>
                <CardTitle>{part.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={part.media?.[0] || "/logo.png"}
                  alt={part.name}
                  width={300}
                  height={200}
                  className="rounded mb-4"
                />

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">מיקומים וברקודים תואמים:</h3>
                  <ul className="space-y-1">
                    {part.providers.map((p: any, idx: number) => (
                      <li key={idx} className="border-b py-1">
                        📦 מיקום: <strong>{p.location}</strong> | ברקוד: <strong>{p.barcode}</strong> | כמות: <strong>{p.quantity}</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                {logTimes[part._id] && (
                  <p className={`mt-4 font-semibold ${getLogColor(logTimes[part._id])}`}>
                    📅 ספירה אחרונה: {new Date(logTimes[part._id]).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
export const dynamic = "force-dynamic";
