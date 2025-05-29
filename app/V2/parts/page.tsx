"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PartsListPage() {
    type Provider = {
        providerName: string;
        price: number;
        barcode: string;
        quantity: number;
        location: string;
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
        providers: Provider[];
    };

    const [parts, setParts] = useState<Part[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [providersList, setProvidersList] = useState<string[]>([]);
    const [filters, setFilters] = useState({
        categories: [] as string[],
        model: "",
        subMake: "",
        year: "",
        providers: [] as string[],
        sortBy: "",
        query: ""
    });

    const router = useRouter();

    useEffect(() => {
        fetch("/api/part")
            .then((res) => res.json())
            .then((data) => setParts(data));

        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data.categories.map((c: { name: string }) => c.name)));

        fetch("/api/providers")
            .then((res) => res.json())
            .then((data) => setProvidersList(data.providers.map((p: { companyName: string }) => p.companyName)));
    }, []);

    const filteredParts = parts
        .filter((part) => {
            const matchesQuery = filters.query.trim() === "" ||
                part._id.toLowerCase().includes(filters.query.toLowerCase()) ||
                part.name.toLowerCase().includes(filters.query.toLowerCase()) ||
                part.subMake.toLowerCase().includes(filters.query.toLowerCase()) ||
                part.carCompanies.some((c) => c.toLowerCase().includes(filters.query.toLowerCase())) ||
                part.providers.some((p) => p.barcode.toLowerCase().includes(filters.query.toLowerCase()));

            return (
                matchesQuery &&
                (filters.categories.length === 0 || filters.categories.includes(part.category)) &&
                (!filters.model || part.carCompanies.includes(filters.model)) &&
                (!filters.subMake || part.subMake.toLowerCase().includes(filters.subMake.toLowerCase())) &&
                (!filters.year || part.modelYears.includes(parseInt(filters.year))) &&
                (filters.providers.length === 0 || filters.providers.some((prov) => part.providers.some((p) => p.providerName === prov)))
            );
        })
        .sort((a, b) => {
            if (filters.sortBy === "price-asc") return a.sellPrice - b.sellPrice;
            if (filters.sortBy === "price-desc") return b.sellPrice - a.sellPrice;
            return 0;
        });

    const toggleSelection = (field: "providers" | "categories", value: string) => {
        setFilters((prev) => {
            const exists = prev[field].includes(value);
            return {
                ...prev,
                [field]: exists ? prev[field].filter((v) => v !== value) : [...prev[field], value],
            };
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">ניהול חלקים</h1>
                <button
                    onClick={() => router.push("/V2/parts/add")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded shadow"
                >
                    ➕ הוסף חלק חדש
                </button>
            </div>



            <div className="mb-6">
                <input
                    type="text"
                    placeholder="חפש לפי מזהה, שם, תת-מותג, חברה או ברקוד..."
                    value={filters.query}
                    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                    className="border p-3 rounded w-full text-sm"
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
                    className="border p-2 rounded"
                />

                <input
                    placeholder="תת-מותג"
                    value={filters.subMake}
                    onChange={(e) => setFilters({ ...filters, subMake: e.target.value })}
                    className="border p-2 rounded"
                />

                <input
                    placeholder="שנה"
                    value={filters.year}
                    onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                    className="border p-2 rounded"
                />

                <div className="col-span-full">
                    <label className="block font-medium text-sm mb-1">ספקים</label>
                    <div className="flex flex-wrap gap-2">
                        {providersList.map((prov, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => toggleSelection("providers", prov)}
                                className={`px-3 py-1 text-sm rounded-full border transition duration-150 ease-in-out ${filters.providers.includes(prov) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'}`}
                            >
                                {prov}
                            </button>
                        ))}
                    </div>
                </div>

                <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="border p-2 rounded"
                >
                    <option value="">מיין לפי</option>
                    <option value="price-asc">מחיר: נמוך לגבוה</option>
                    <option value="price-desc">מחיר: גבוה לנמוך</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredParts.map((part) => {
                    const quantity = filters.providers.length > 0
                        ? part.providers.filter((p) => filters.providers.includes(p.providerName)).reduce((sum, p) => sum + (p.quantity || 0), 0)
                        : part.providers.reduce((sum, p) => sum + (p.quantity || 0), 0);

                    const providerNames = Array.from(new Set(part.providers.map((p) => p.providerName))).join(", ");

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
                                    <div className="w-[160px] h-[160px] flex items-center justify-center bg-gray-200 rounded">
                                        -
                                    </div>
                                )}
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-1">{part.name}</h2>
                            <p className="text-sm text-gray-500 mb-2">₪{part.sellPrice.toFixed(2)}</p>
                            <p className="text-sm text-gray-700 mb-1"><strong>כמות:</strong> {quantity}</p>
                            <p className="text-sm text-gray-700 mb-1"><strong>ספקים:</strong> {providerNames}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
export const dynamic = "force-dynamic";
