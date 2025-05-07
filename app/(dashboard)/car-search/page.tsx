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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">חיפוש לפי מספר רכב</h1>

      <div className="flex gap-2 max-sm:flex-col">
        <input
          type="text"
          placeholder="מספר רכב"
          value={carNumber}
          onChange={(e) => setCarNumber(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          חפש
        </button>
      </div>

      {loading && <p className="mt-4 text-center">טוען...</p>}

      {result?.result?.records?.length > 0 && (
        <div className="mt-6 grid gap-6">
          {result.result.records.map((car: any) => (
            <div
              key={car._id}
              className="border rounded-lg shadow-md p-5 bg-white text-sm"
            >
              <h2 className="text-lg font-semibold text-blue-700 mb-3">
                {car.kinuy_mishari || "דגם לא ידוע"} ({car.degem_nm})
              </h2>
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <div><strong>מספר רכב:</strong> {car.mispar_rechev}</div>
                <div><strong>שנת יצור:</strong> {car.shnat_yitzur}</div>
                <div><strong>צבע:</strong> {car.tzeva_rechev}</div>
                <div><strong>בעלות:</strong> {car.baalut}</div>
                <div><strong>יצרן:</strong> {car.tozeret_nm}</div>
                <div><strong>רמת גימור:</strong> {car.ramat_gimur}</div>
                <div><strong>דגם מנוע:</strong> {car.degem_manoa}</div>
                <div><strong>סוג דלק:</strong> {car.sug_delek_nm}</div>
                <div><strong>צמיג קדמי:</strong> {car.zmig_kidmi}</div>
                <div><strong>צמיג אחורי:</strong> {car.zmig_ahori}</div>
                <div><strong>טסט אחרון:</strong> {car.mivchan_acharon_dt}</div>
                <div><strong>תוקף טסט:</strong> {car.tokef_dt}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {result?.result?.records?.length === 0 && !loading && (
        <p className="mt-6 text-center text-gray-500">לא נמצאו תוצאות.</p>
      )}
    </div>
  );
}
