"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    PackageOpen,
    BadgeCheck,
    Clock3,
    User2,
    FileImage,
    FileText,
    AlertCircle,
    Pencil,
    Trash2,
    Plus,
} from "lucide-react";

type ReturnedPart = {
    partId: string;
    providerBarcode: string;
    quantity: number;
    price: number;
    reason?: string;
};

type ReturnRequest = {
    _id: string;
    providerName: string;
    contactName?: string;
    status: string;
    date: string;
    parts: ReturnedPart[];
    photos: string[];
};

const statusColorMap: Record<string, string> = {
    "בהמתנה": "bg-yellow-100 text-yellow-800",
    "מאושר": "bg-green-100 text-green-800",
    "נדחה": "bg-red-100 text-red-800",
};

export default function ReturnsListPage() {
    const [returns, setReturns] = useState<ReturnRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [partNames, setPartNames] = useState<Map<string, string>>(new Map());
    const router = useRouter();

    useEffect(() => {
        const fetchReturns = async () => {
            try {
                const res = await fetch("/api/returns");
                const data = await res.json();
                if (data.success) {
                    setReturns(data.returns);
                } else {
                    toast.error("\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05d8\u05e2\u05d9\u05e0\u05ea \u05d4\u05e7\u05e8\u05d9\u05d0\u05d5\u05ea");
                }
            } catch (err) {
                toast.error("\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05d8\u05e2\u05d9\u05e0\u05d4");
            } finally {
                setLoading(false);
            }
        };

        fetchReturns();
    }, []);

    const getPartName = async (id: string) => {
        if (partNames.has(id)) return;

        try {
            const res = await fetch(`/api/part/${id}`);
            const data = await res.json();
            if (data && data.name) {
                setPartNames((prev) => new Map(prev).set(id, data.name));
            } else {
                setPartNames((prev) => new Map(prev).set(id, "מוצר לא נמצא"));
            }
        } catch (e) {
            setPartNames((prev) => new Map(prev).set(id, "שגיאה"));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("\u05d4\u05d0ם \u05d0\u05eaה \u05d1\u05d8\u05d5\u05d7 \u05e9\u05d1\u05e8צ\u05d5\u05e0\u05da \u05dc\u05de\u05d7\u05d5\u05e7 \u05e7\u05e8\u05d9\u05d0ה \u05d6\u05d5?"))
            return;

        try {
            const res = await fetch("/api/returns", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await res.json();
            if (data.success) {
                setReturns((prev) => prev.filter((r) => r._id !== id));
                toast.success("\u05d4\u05e7\u05e8\u05d9\u05d0ה נמחקה בהצלחה");
            } else {
                toast.error("\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1מחיקה");
            }
        } catch (err) {
            toast.error("\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1ל\u05ea\u05d9 \u05e6\u05e4\u05d5\u05d9");
        }
    };

    if (loading) return <div className="p-6 text-center animate-pulse">🔄 טוען קריאות...</div>;
    if (!returns.length) {
        return (
            <div className="p-6 max-w-5xl mx-auto space-y-6" dir="rtl">
                <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-2">
                    <PackageOpen className="w-8 h-8" /> קריאות החזרה
                </h1>
                <div className="flex justify-end">
                    <button
                        onClick={() => router.push("/V2/returns/add")}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        <Plus className="w-4 h-4" />
                        הוסף קריאה חדשה
                    </button>
                </div>
                <div className="text-center text-gray-500">אין קריאות חזרה להצגה</div>
            </div>
        );
    }
    

    return (
        <div dir="rtl" className="p-6 max-w-5xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-2">
                <PackageOpen className="w-8 h-8" /> קריאות החזרה
            </h1>
            <div className="flex justify-end">
                <button
                    onClick={() => router.push("/V2/returns/add")}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    הוסף קריאה חדשה
                </button>
            </div>

            {returns.map((r) => (
                <motion.div
                    key={r._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="p-6 rounded-2xl border shadow hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="text-xl font-semibold flex items-center gap-2">
                                <BadgeCheck className="w-5 h-5 text-blue-600" />
                                {r.providerName}
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColorMap[r.status] || "bg-gray-200 text-gray-700"}`}
                            >
                                {r.status}
                            </span>
                        </div>

                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <Clock3 className="w-4 h-4" />
                            {new Date(r.date).toLocaleDateString("he-IL", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </div>

                        {r.contactName && (
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                                <User2 className="w-4 h-4" />
                                {r.contactName}
                            </div>
                        )}

                        <Separator className="my-4" />

                        <div className="space-y-2">
                            <h3 className="font-medium flex items-center gap-1">
                                <FileText className="w-4 h-4" /> מוצרים שהוחזרו:
                            </h3>
                            <div className="grid gap-2">
                                {r.parts.map((part, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-gray-100 rounded-lg px-3 py-2 text-sm flex flex-col gap-1"
                                    >
                                        <div>
                                            🔧 מזהה: {partNames.has(part.partId) ? (
                                                <Link href={`/V2/parts/${part.partId}`} className="text-blue-600 hover:underline">
                                                    {partNames.get(part.partId)}
                                                </Link>
                                            ) : (
                                                <>
                                                    <span className="text-gray-400">טוען...</span>
                                                    {getPartName(part.partId)}
                                                </>
                                            )}
                                        </div>
                                        <div>🏷️ ברקוד ספק: {part.providerBarcode}</div>
                                        <div>🔢 כמות: {part.quantity}</div>
                                        <div>💰 מחיר: ₪{part.price.toFixed(2)}</div>
                                        {part.reason && (
                                            <div className="flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                                                סיבה: {part.reason}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {r.photos.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <h3 className="font-medium flex items-center gap-1">
                                    <FileImage className="w-4 h-4" /> תמונות תקלה:
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {r.photos.map((url, idx) => (
                                        <Image
                                            key={idx}
                                            src={url}
                                            alt={`תמונה ${idx + 1}`}
                                            width={200}
                                            height={200}
                                            onClick={() => setExpandedImage(url)}
                                            className="rounded-lg border object-cover max-h-48 w-full cursor-pointer hover:scale-105 transition-transform"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <Separator className="my-4" />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => router.push(`/V2/returns/edit/${r._id}`)}
                                className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition "
                            >
                                <Pencil className="w-4 h-4" />
                                ערוך
                            </button>
                            <button
                                onClick={() => handleDelete(r._id)}
                                className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                            >
                                <Trash2 className="w-4 h-4" />
                                מחק
                            </button>
                        </div>
                    </Card>
                </motion.div>
            ))}

            {expandedImage && (
                <div
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
                    onClick={() => setExpandedImage(null)}
                >
                    <Image
                        src={expandedImage}
                        alt="תמונה מורחבת"
                        width={800}
                        height={800}
                        className="rounded-xl max-w-full max-h-full object-contain"
                    />
                </div>
            )}
        </div>
    );
}
