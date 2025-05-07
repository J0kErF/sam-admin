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
        <pre className="mt-6 bg-gray-100 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
