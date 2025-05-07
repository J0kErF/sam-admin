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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
                                {[
                                    ["מספר רכב", car.mispar_rechev],
                                    ["יצרן", car.tozeret_nm],
                                    ["דגם", car.degem_nm],
                                    ["שנת יצור", car.shnat_yitzur],
                                    ["צבע", car.tzeva_rechev],
                                    ["דלק", car.sug_delek_nm],
                                    ["טסט בתוקף עד", car.tokef_dt],
                                    ["בעלות", car.baalut],
                                    ["שלדה", car.misgeret],
                                    ["דגם מנוע", car.degem_manoa],
                                    ["קבוצת זיהום", car.kvutzat_zihum],
                                    ["סוג דגם", car.sug_degem],
                                    ["צמיג קדמי", car.zmig_kidmi],
                                    ["צמיג אחורי", car.zmig_ahori],
                                    ["תאריך עלייה לכביש", car.moed_aliya_lakvish],
                                ].map(([label, value], idx) => (
                                    <div key={idx} className="flex justify-between border-b py-1">
                                        <span className="font-medium text-gray-600">{label}:</span>
                                        <span className="text-right text-gray-900">{value || "-"}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
