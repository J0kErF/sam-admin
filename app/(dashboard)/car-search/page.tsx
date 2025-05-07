"use client";

import { useState } from "react";

export default function CarSearchPage() {
    const [carNumber, setCarNumber] = useState("");
    const [result, setResult] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!carNumber.trim()) return;

        setLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/car-search?q=${carNumber}`);
            if (!res.ok) throw new Error("Failed to fetch data");

            const data = await res.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
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
            {error && <p className="mt-4 text-center text-red-500">{error}</p>}

            {result.length > 0 && (
                <div className="mt-6 flex flex-col gap-4">
                    {result.map((car, i) => (
                        <div key={i} className="bg-white border rounded-lg shadow-sm p-4">
                            <h2 className="text-lg font-semibold text-blue-700 mb-2">
                                {car.kinuy_mishari || "רכב"}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-800">
                                <div><strong>מספר רכב:</strong> {car.mispar_rechev}</div>
                                <div><strong>יצרן:</strong> {car.tozeret_nm}</div>
                                <div><strong>דגם:</strong> {car.degem_nm}</div>
                                <div><strong>שנת יצור:</strong> {car.shnat_yitzur}</div>
                                <div><strong>צבע:</strong> {car.tzeva_rechev}</div>
                                <div><strong>דלק:</strong> {car.sug_delek_nm}</div>
                                <div><strong>טסט בתוקף עד:</strong> {car.tokef_dt}</div>
                                <div><strong>בעלות:</strong> {car.baalut}</div>
                                <div><strong>שלדה:</strong> {car.misgeret}</div>
                                <div><strong>דגם מנוע:</strong> {car.degem_manoa}</div>
                                <div><strong>קבוצת זיהום:</strong> {car.kvutzat_zihum}</div>
                                <div><strong>סוג דגם:</strong> {car.sug_degem}</div>
                                <div><strong>צמיג קדמי:</strong> {car.zmig_kidmi}</div>
                                <div><strong>צמיג אחורי:</strong> {car.zmig_ahori}</div>
                                <div><strong>תאריך עלייה לכביש:</strong> {car.moed_aliya_lakvish}</div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
