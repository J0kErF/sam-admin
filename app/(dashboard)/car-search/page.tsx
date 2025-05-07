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
                    {result && result.result && result.result.records && (
                        <div className="mt-6 grid gap-4">
                            {result.result.records.map((car: any, index: number) => (
                                <div key={index} className="border rounded-lg p-4 shadow-sm bg-white">
                                    <h2 className="text-lg font-semibold text-blue-700 mb-2">
                                        {car.kinuy_mishari || "רכב"}
                                    </h2>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                                        <div>
                                            <span className="font-medium">מספר רכב:</span> {car.mispar_rechev}
                                        </div>
                                        <div>
                                            <span className="font-medium">שם יצרן:</span> {car.tozeret_nm}
                                        </div>
                                        <div>
                                            <span className="font-medium">דגם:</span> {car.degem_nm}
                                        </div>
                                        <div>
                                            <span className="font-medium">שנת יצור:</span> {car.shnat_yitzur}
                                        </div>
                                        <div>
                                            <span className="font-medium">צבע:</span> {car.tzeva_rechev}
                                        </div>
                                        <div>
                                            <span className="font-medium">דלק:</span> {car.sug_delek_nm}
                                        </div>
                                        <div>
                                            <span className="font-medium">תוקף טסט:</span> {car.tokef_dt}
                                        </div>
                                        <div>
                                            <span className="font-medium">בעלות:</span> {car.baalut}
                                        </div>
                                        <div>
                                            <span className="font-medium">מספר שלדה:</span> {car.misgeret}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </pre>

            )}
        </div>
    );
}
