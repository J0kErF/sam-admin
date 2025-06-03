"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/custom ui/ImageUpload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ReturnForm } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";

export default function EditReturnPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [providers, setProviders] = useState<{ _id: string; companyName: string }[]>([]);
    const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
    const [form, setForm] = useState<ReturnForm>({
        providerName: "",
        contactName: "",
        status: "בהמתנה",
        photos: [],
        parts: [
            {
                partId: "",
                providerBarcode: "",
                quantity: 1,
                price: 0,
                reason: "",
            },
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [providersRes, productsRes, returnRes] = await Promise.all([
                    fetch("/api/providers"),
                    fetch("/api/part"),
                    fetch(`/api/returns/${id}`),
                ]);

                const providersData = await providersRes.json();
                setProviders(providersData.providers);

                const productsData = await productsRes.json();
                if (Array.isArray(productsData)) {
                    setProducts(productsData.map((p: any) => ({ id: p._id, name: p.name })));
                }

                const returnData = await returnRes.json();
                if (returnData.success) {
                    setForm(returnData.data);
                } else {
                    toast.error("שגיאה בטעינת הקריאה");
                }
            } catch (err) {
                toast.error("שגיאה בטעינת הנתונים");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleImageChange = (url: string) => {
        setForm((prev) => ({ ...prev, photos: [...prev.photos, url] }));
    };

    const handleImageRemove = (url: string) => {
        setForm((prev) => ({ ...prev, photos: prev.photos.filter((img) => img !== url) }));
    };

    const handlePartChange = <K extends keyof ReturnForm["parts"][0]>(
        index: number,
        field: K,
        value: ReturnForm["parts"][0][K]
    ) => {
        const updatedParts = [...form.parts];
        updatedParts[index][field] = value;
        setForm((prev) => ({ ...prev, parts: updatedParts }));
    };

    const addPart = () => {
        setForm((prev) => ({
            ...prev,
            parts: [...prev.parts, { partId: "", providerBarcode: "", quantity: 1, price: 0, reason: "" }],
        }));
    };

    const removePart = (index: number) => {
        const updated = form.parts.filter((_, i) => i !== index);
        setForm((prev) => ({ ...prev, parts: updated }));
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch(`/api/returns/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("שגיאה בעדכון הקריאה");

            toast.success("קריאה עודכנה בהצלחה");
            router.push("/V2/returns");
        } catch (err) {
            toast.error("שגיאה בעדכון: " + (err as Error).message);
        }
    };

    if (loading) return <div className="p-6 text-center">🔄 טוען...</div>;

    return (
        <div dir="rtl" className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">✏️ עריכת קריאת החזרה</h1>

            <Card className="p-5 space-y-6">
                <Card className="p-4 space-y-4">
                    <div>
                        <label className="font-medium">שם הספק</label>
                        <select
                            name="providerName"
                            value={form.providerName}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        >
                            <option value="">בחר ספק</option>
                            {providers.map((provider) => (
                                <option key={provider.companyName} value={provider.companyName}>
                                    {provider.companyName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="font-medium">איש קשר</label>
                        <Input name="contactName" value={form.contactName} onChange={handleChange} placeholder="איש קשר" />
                    </div>

                    <div>
                        <label className="font-medium">סטטוס</label>
                        <Input name="status" value={form.status} onChange={handleChange} placeholder="סטטוס (למשל: בהמתנה)" />
                    </div>
                </Card>

                <Card className="p-4">
                    <label className="font-medium">תמונות תקלה</label>
                    <ImageUpload value={form.photos} onChange={handleImageChange} onRemove={handleImageRemove} />
                </Card>

                <Separator />
                <p className="text-sm font-semibold">מוצרים מוחזרים:</p>

                {form.parts.map((item, index) => (
                    <Card key={index} className="p-4 space-y-3">
                        <div>
                            <label className="text-sm">בחר מוצר</label>
                            <select
                                value={item.partId}
                                onChange={(e) => handlePartChange(index, "partId", e.target.value)}
                                className="border p-2 rounded w-full"
                            >
                                <option value="">בחר מוצר</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm">ברקוד אצל הספק</label>
                            <Input
                                placeholder="ברקוד הספק"
                                value={item.providerBarcode}
                                onChange={(e) => handlePartChange(index, "providerBarcode", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm">כמות</label>
                            <Input
                                placeholder="כמות"
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handlePartChange(index, "quantity", parseInt(e.target.value))}
                            />
                        </div>

                        <div>
                            <label className="text-sm">מחיר</label>
                            <Input
                                placeholder="מחיר"
                                type="number"
                                value={item.price}
                                onChange={(e) => handlePartChange(index, "price", parseFloat(e.target.value))}
                            />
                        </div>

                        <div>
                            <label className="text-sm">סיבה</label>
                            <Input
                                placeholder="סיבה"
                                value={item.reason}
                                onChange={(e) => handlePartChange(index, "reason", e.target.value)}
                            />
                        </div>

                        <Button variant="destructive" onClick={() => removePart(index)} className="w-full">
                            הסר מוצר
                        </Button>
                    </Card>
                ))}

                <Button variant="outline" onClick={addPart} className="w-full">
                    + הוסף מוצר נוסף
                </Button>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit}>
                    💾 עדכן קריאה
                </Button>
            </Card>
        </div>
    );
}
