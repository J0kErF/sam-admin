"use client";

import { useState } from "react";

export default function CarSearchPage() {
  const [carNumber, setCarNumber] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!carNumber.trim()) return;

    setLoading(true);
    const res = await fetch(`/api/car-search?q=${carNumber}`);
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">חיפוש לפי מספר רכב</h1>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="מספר רכב"
          value={carNumber}
          onChange={(e) => setCarNumber(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 rounded">
          חפש
        </button>
      </div>

      {loading && <p className="mt-4 text-center">טוען...</p>}

      {result && (
       <div className="mt-6 grid gap-4 bg-gray-50 p-5 rounded-lg shadow-sm">
       {Object.entries(result).map(([key, value]) => (
         <div
           key={key}
           className="grid grid-cols-2 gap-2 bg-white p-3 rounded border hover:shadow transition"
         >
           <span className="font-semibold text-gray-700">{key}</span>
           <span className="text-gray-600 break-all">{String(value)}</span>
         </div>
       ))}
     </div>
     
      )}
    </div>
  );
}
