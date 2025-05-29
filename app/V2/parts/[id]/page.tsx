"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ImageUpload from "@/components/custom ui/ImageUpload";
import { QRCodeSVG } from "qrcode.react";

export default function Page() {

    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [showCartModal, setShowCartModal] = useState(false);
    const [selectedCartProvider, setSelectedCartProvider] = useState("");
    const [cartQuantity, setCartQuantity] = useState(1);


    const [form, setForm] = useState<{
        name: string;
        modelYearFrom: number;
        modelYearTo: number;
        carCompanies: string[];
        subMake: string;
        sellPrice: number;
        category: string;
        media: string[];
        providers: {
            providerName: string;
            price: number | string;
            barcode: string;
            quantity: number | string;
            location: string;
        }[];
    }>({
        name: "",
        modelYearFrom: 2000,
        modelYearTo: 2025,
        carCompanies: [],
        subMake: "",
        sellPrice: 0,
        category: "",
        media: [],
        providers: []
    });

    const [availableProviders, setAvailableProviders] = useState<string[]>([]);
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    const qrRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        fetch(`/api/part/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setForm({
                    ...data,
                    modelYearFrom: Math.min(...data.modelYears),
                    modelYearTo: Math.max(...data.modelYears)
                });
                setLoading(false);
            });

        fetch("/api/providers")
            .then((res) => res.json())
            .then((data) => {
                const names = data.providers.map((prov: { companyName: string }) => prov.companyName);
                setAvailableProviders(names);
            });

        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => {
                const names = data.categories.map((cat: { name: string }) => cat.name);
                setAvailableCategories(names);
            });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (url: string) => {
        setForm((prev) => ({ ...prev, media: [...prev.media, url] }));
    };

    const handleImageRemove = (url: string) => {
        setForm((prev) => ({ ...prev, media: prev.media.filter((img) => img !== url) }));
    };

    const handleProviderChange = (
        index: number,
        field: keyof (typeof form.providers)[number],
        value: string
    ) => {
        const updated = [...form.providers];
        updated[index][field] = value;
        setForm({ ...form, providers: updated });
    };

    const addProvider = () => {
        setForm({
            ...form,
            providers: [...form.providers, { providerName: "", price: "", barcode: "", quantity: "", location: "" }]
        });
    };

    const removeProvider = (index: number) => {
        const updated = form.providers.filter((_, i) => i !== index);
        setForm({ ...form, providers: updated });
    };

    const handleUpdate = () => {
        setShowReasonModal(true);
    };

    const confirmUpdate = async (reason: string) => {
        const modelYears = [];
        for (let y = parseInt(form.modelYearFrom as any); y <= parseInt(form.modelYearTo as any); y++) {
            modelYears.push(y);
        }

        const totalQuantity = form.providers.reduce(
            (sum, p) => sum + parseInt(String(p.quantity || 0)),
            0
        );

        const updateRes = await fetch(`/api/part/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                updateReason: reason,
                modelYears,
                sellPrice: parseFloat(String(form.sellPrice)),
                carCompanies: form.carCompanies.map(String),
                providers: form.providers.map((p) => ({
                    ...p,
                    price: parseFloat(String(p.price)),
                    quantity: parseInt(String(p.quantity)),
                })),
            }),
        });

        if (updateRes.ok) {
            await fetch("/api/logs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    partId: id,
                    reason,
                    quantity: totalQuantity,
                }),
            });

            alert("✅ חלק עודכן בהצלחה.");
        } else {
            alert("❌ שגיאה בעדכון החלק.");
        }
    };




    const handleDelete = async () => {
        const confirmed = confirm("האם אתה בטוח שברצונך למחוק חלק זה?");
        if (!confirmed) return;

        const res = await fetch(`/api/part/${id}`, { method: "DELETE" });
        if (res.ok) router.push("/parts");
    };

    if (loading) return <p className="p-6">טוען...</p>;

    return (

        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">ערוך חלק</h2>

                </div>
                <button
                    onClick={() => setShowCartModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm"
                >
                    ➕ הוסף לעגלת הקניות
                </button>
            </div>
            {showCartModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 text-center">הוסף לעגלת הקניות</h3>

                        <div className="mb-4">
                            <label className="block mb-1 text-sm">בחר ספק</label>
                            <select
                                value={selectedCartProvider}
                                onChange={(e) => setSelectedCartProvider(e.target.value)}
                                className="border p-2 rounded w-full"
                            >
                                <option value="">-- בחר ספק --</option>
                                {form.providers.map((prov, idx) => (
                                    <option key={idx} value={prov.providerName}>
                                        {prov.providerName} (₪{prov.price})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 text-sm">כמות</label>
                            <input
                                type="number"
                                value={cartQuantity}
                                onChange={(e) => setCartQuantity(parseInt(e.target.value))}
                                className="border p-2 rounded w-full"
                                min={1}
                            />
                        </div>

                        <div className="flex justify-between gap-4">
                            <button
                                onClick={() => setShowCartModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                            >
                                ביטול
                            </button>
                            <button
                                onClick={async () => {
                                    const provider = form.providers.find((p) => p.providerName === selectedCartProvider);
                                    if (!provider) return alert("Please select a valid provider");

                                    await fetch("/api/cart", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            productId: id,
                                            name: form.name,
                                            barcode: provider.barcode,
                                            quantity: cartQuantity,
                                            selectedProvider: {
                                                name: provider.providerName,
                                                phone: "", // You can later pull this from DB if needed
                                                price: provider.price,
                                            },
                                            availableProviders: form.providers.map((p) => ({
                                                name: p.providerName,
                                                phone: "",
                                                price: p.price,
                                            })),
                                        }),
                                    });

                                    setShowCartModal(false);
                                    alert("🛒 נוסף לעגלה!");
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                הוסף לעגלה
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showReasonModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 text-center">בחר סיבת עדכון</h3>
                        <ul className="space-y-2">
                            {["תיקון כללי", "יחידות בשימוש/נמכרות", "יחידות שהתקבלו", "בעיה באיכות", "ספירת מלאי"].map((r, i) => (
                                <li
                                    key={i}
                                    onClick={() => {
                                        setSelectedReason(r);
                                        setShowReasonModal(false);
                                        setTimeout(() => confirmUpdate(r), 100); // pass the reason directly
                                    }}

                                    className="border border-gray-300 p-2 rounded cursor-pointer hover:bg-gray-100 text-center"
                                >
                                    {r}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white shadow rounded-xl p-4 sm:p-6">
                    <div className="space-y-3">
                        <input name="name" value={form.name} placeholder="שם חלק" onChange={handleChange} className="border p-3 rounded w-full" />
                        <input name="sellPrice" value={form.sellPrice} placeholder="מחיר מכירה" type="number" onChange={handleChange} className="border p-3 rounded w-full" />
                        <div className="flex gap-3">
                            <input
                                type="number"
                                name="modelYearFrom"
                                placeholder="שנה מ"
                                value={form.modelYearFrom}
                                onChange={handleChange}
                                className="border p-3 rounded w-full"
                            />
                            <input
                                type="number"
                                name="modelYearTo"
                                placeholder="שנה עד"
                                value={form.modelYearTo}
                                onChange={handleChange}
                                className="border p-3 rounded w-full"
                            />
                        </div>
                        <input name="carCompanies" value={form.carCompanies.join(",")} placeholder="חברות רכב" onChange={(e) => setForm({ ...form, carCompanies: e.target.value.split(",").map((x) => x.trim()) })} className="border p-3 rounded w-full" />
                        <input name="subMake" value={form.subMake} placeholder="תת-מותג" onChange={handleChange} className="border p-3 rounded w-full" />
                        <select name="category" value={form.category} onChange={handleChange} className="border p-3 rounded w-full">
                            <option value="">בחר קטגוריה</option>
                            {availableCategories.map((cat, idx) => (
                                <option key={idx} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-white shadow rounded-xl p-4 sm:p-6">
                    <h3 className="font-semibold mb-3 text-gray-700">תמונות</h3>
                    <ImageUpload value={form.media} onChange={handleImageChange} onRemove={handleImageRemove} />
                </div>
            </div>

            <div className="bg-white shadow rounded-xl p-4 sm:p-6 mt-6">
                <h3 className="font-semibold mb-4 text-gray-700">ספקים</h3>
                {form.providers.map((prov, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
                        <select
                            value={prov.providerName}
                            onChange={(e) => handleProviderChange(idx, "providerName", e.target.value)}
                            className="border p-2 rounded w-full"
                        >
                            <option value="">בחר ספק</option>
                            {availableProviders.map((name, index) => (
                                <option key={index} value={name}>{name}</option>
                            ))}
                        </select>
                        <input
                            placeholder="מחיר"
                            type="number"
                            value={prov.price}
                            onChange={(e) => handleProviderChange(idx, "price", e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                        <input
                            placeholder="ברקוד"
                            value={prov.barcode}
                            onChange={(e) => handleProviderChange(idx, "barcode", e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                        <input
                            placeholder="כמות"
                            type="number"
                            value={prov.quantity}
                            onChange={(e) => handleProviderChange(idx, "quantity", e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                        <div className="flex gap-2">
                            <input
                                placeholder="מיקום"
                                value={prov.location}
                                onChange={(e) => handleProviderChange(idx, "location", e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                            <button type="button" onClick={() => removeProvider(idx)} className="text-red-600 hover:underline text-sm">הסר</button>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addProvider} className="text-blue-600 hover:underline mt-2 text-sm">+ הוסף ספק</button>
            </div>
            <div className="bg-white shadow rounded-xl p-6 mt-6 flex items-center justify-between gap-6">
                <div className="flex flex-col items-start">
                    <p className="font-medium text-gray-700 mb-2">
                        סרוק קוד זה כדי להפנות לחלק זה: <span className="text-blue-600">{form.name}</span>
                    </p>
                    <QRCodeSVG
                        ref={qrRef}
                        value={String(id)}
                        size={150}
                        className="border rounded-lg p-2 bg-white"
                    />
                </div>
                <button
                    onClick={() => {
                        const svg = qrRef.current;
                        if (!svg) return;

                        const serializer = new XMLSerializer();
                        const svgString = serializer.serializeToString(svg);
                        const blob = new Blob([svgString], { type: "image/svg+xml" });
                        const url = URL.createObjectURL(blob);

                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `qr-${form.name.replace(/\s+/g, "-").toLowerCase()}.svg`;
                        link.click();
                        URL.revokeObjectURL(url);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                >
                    ⬇️ הורד קוד QR
                </button>
            </div>

            <div className="flex justify-end gap-4 mt-6">
                <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    עדכן
                </button>
                <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    מחק
                </button>
            </div>

        </div>
    );
}
