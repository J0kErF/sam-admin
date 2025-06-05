"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function OnsitePartsPage() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("query") || "";
    type Provider = {
        quantity: number;
        [key: string]: any; // optional: allows flexibility
    };
    type Part = {
        _id: string;
        name: string;
        sellPrice: number;
        modelYears: number[];
        carCompanies: string[];
        subMake: string;
        category: string;
        media: string[];
        companyBarcode?: string;
        isOnsite?: boolean;
        providers: Provider[];
    };

    const [parts, setParts] = useState<Part[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [filters, setFilters] = useState({
        categories: [] as string[],
        model: "",
        subMake: "",
        year: "",
        sortBy: "",
        query: initialQuery,
    });

    const router = useRouter();

    useEffect(() => {
        fetch("/api/part")
            .then((res) => res.json())
            .then((data) => setParts(data.filter((part: Part) => part.isOnsite)));

        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data.categories.map((c: { name: string }) => c.name)));
    }, []);

    const filteredParts = parts
        .filter((part) => {
            const matchesQuery =
                filters.query.trim() === "" ||
                part._id.toLowerCase().includes(filters.query.toLowerCase()) ||
                part.name.toLowerCase().includes(filters.query.toLowerCase()) ||
                part.subMake.toLowerCase().includes(filters.query.toLowerCase()) ||
                part.carCompanies.some((c) => c.toLowerCase().includes(filters.query.toLowerCase())) ||
                (part.companyBarcode?.toLowerCase().includes(filters.query.toLowerCase()));

            return (
                part.isOnsite &&
                matchesQuery &&
                (filters.categories.length === 0 || filters.categories.includes(part.category)) &&
                (!filters.model || part.carCompanies.includes(filters.model)) &&
                (!filters.subMake || part.subMake.toLowerCase().includes(filters.subMake.toLowerCase())) &&
                (!filters.year || part.modelYears.includes(parseInt(filters.year)))
            );
        })
        .sort((a, b) => {
            if (filters.sortBy === "price-asc") return a.sellPrice - b.sellPrice;
            if (filters.sortBy === "price-desc") return b.sellPrice - a.sellPrice;
            return 0;
        });

    const toggleSelection = (field: "categories", value: string) => {
        setFilters((prev) => {
            const exists = prev[field].includes(value);
            return {
                ...prev,
                [field]: exists ? prev[field].filter((v) => v !== value) : [...prev[field], value],
            };
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto" dir="rtl">
            <h1 className="text-2xl font-bold mb-6">חלקים לצמה</h1>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="חפש לפי מזהה, שם, תת-מותג, חברה או ברקוד יצרן..."
                    value={filters.query}
                    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                    className="border p-3 rounded w-full text-sm text-right"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="col-span-full">
                    <label className="block font-medium text-sm mb-1">קטגוריות</label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => toggleSelection("categories", cat)}
                                className={`px-3 py-1 text-sm rounded-full border transition duration-150 ease-in-out ${filters.categories.includes(cat) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <input
                    placeholder="מודל"
                    value={filters.model}
                    onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                    className="border p-2 rounded text-right"
                />


                <input
                    placeholder="שנה"
                    value={filters.year}
                    onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                    className="border p-2 rounded text-right"
                />

                <button
                    onClick={() => router.push("/V2/scan2")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded shadow"
                >
                    📷 סרוק ברקוד
                </button>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredParts.map((part) => {
                    const totalQuantity = part.providers.reduce((sum, p) => sum + (p.quantity || 0), 0);

                    return (
                        <div
                            key={part._id}
                            onClick={() => router.push(`/V2/parts/${part._id}`)}
                            className="cursor-pointer bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition"
                        >
                            <div className="mb-4">
                                {part.media?.[0] ? (
                                    <Image
                                        src={part.media[0]}
                                        alt={part.name}
                                        width={160}
                                        height={160}
                                        className="rounded object-cover mx-auto"
                                    />
                                ) : (
                                    <div className="w-[160px] h-[160px] flex items-center justify-center bg-gray-200 rounded text-gray-500">
                                        אין תמונה
                                    </div>
                                )}
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-1">{part.name}</h2>
                            <p className="text-sm text-gray-500 mb-1">₪{part.sellPrice.toFixed(2)}</p>
                            <p className="text-sm text-gray-700 mb-1"><strong>כמות:</strong> {totalQuantity}</p>
                            <p className="text-xs text-gray-500 mt-1"><strong>ברקוד יצרן:</strong> {part.companyBarcode || "-"}</p>
                            {part.isOnsite && (
                                <span className="mt-2 inline-block text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full font-medium">
                                    לצמה
                                </span>
                            )}
                        </div>
                    );
                })}

            </div>
        </div>
    );
}
