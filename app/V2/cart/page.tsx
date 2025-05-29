"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartProduct = {
    productId: string;
    name: string;
    barcode: string;
    quantity: number;
    selectedProvider: {
        name: string;
        phone: string;
        price: number;
    };
    availableProviders: {
        name: string;
        phone: string;
        price: number;
    }[];
};

type Cart = {
    updatedAt: string;
    products: CartProduct[];
};

export default function CartPage() {
    const [cart, setCart] = useState<Cart | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/cart")
            .then((res) => res.json())
            .then(setCart);
    }, []);

    if (!cart) return <p className="p-6">טוען...</p>;

    const total = cart.products.reduce(
        (sum, p) => sum + p.quantity * p.selectedProvider.price,
        0
    );

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">🛒 סקירת עגלת קניות</h1>

            {cart.products.length === 0 ? (
                <p className="text-gray-600">העגלה שלך ריקה.</p>
            ) : (
                <div className="overflow-x-auto shadow rounded-lg">
                    <table className="min-w-full text-sm text-left border border-gray-200">
                        <thead className="bg-gray-100 text-gray-700 font-semibold">
                            <tr>
                                <th className="px-4 py-2">מוצר</th>
                                <th className="px-4 py-2">ברקוד</th>
                                <th className="px-4 py-2">ספק</th>
                                <th className="px-4 py-2">טלפון</th>
                                <th className="px-4 py-2">מחיר</th>
                                <th className="px-4 py-2">כמות</th>
                                <th className="px-4 py-2">סכום ביניים</th>
                                <th className="px-4 py-2">פעולות</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cart.products.map((p) => (
                                <tr key={p.productId} className="border-t">
                                    <td className="px-4 py-2 text-blue-700 underline cursor-pointer" onClick={() => router.push(`/V2/parts/${p.productId}`)}>
                                        {p.name}
                                    </td>
                                    <td className="px-4 py-2">{p.barcode}</td>
                                    <td className="px-4 py-2">{p.selectedProvider.name}</td>
                                    <td className="px-4 py-2">{p.selectedProvider.phone}</td>
                                    <td className="px-4 py-2">₪{p.selectedProvider.price.toFixed(2)}</td>

                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            value={p.quantity}
                                            min={1}
                                            className="border p-1 w-16 rounded"
                                            onChange={(e) => {
                                                const newQuantity = parseInt(e.target.value);
                                                if (newQuantity > 0) {
                                                    fetch("/api/cart", {
                                                        method: "PUT",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ ...p, quantity: newQuantity }),
                                                    }).then((res) => res.json()).then(setCart);
                                                }
                                            }}
                                        />
                                    </td>

                                    <td className="px-4 py-2 font-medium">
                                        ₪{(p.quantity * p.selectedProvider.price).toFixed(2)}
                                    </td>

                                    <td className="px-4 py-2">
                                        <button
                                            onClick={async () => {
                                                const res = await fetch("/api/cart", {
                                                    method: "DELETE",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        productId: p.productId,
                                                        providerName: p.selectedProvider.name,
                                                    }),
                                                });

                                                if (res.ok) {
                                                    const updatedCart = await res.json();
                                                    setCart(updatedCart);
                                                } else {
                                                    alert("❌ שגיאה בהסרת מוצר מהעגלה");
                                                }
                                            }}
                                            className="text-red-600 hover:underline text-sm"
                                        >
                                            הסר
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                    <div className="text-right mt-4 pr-4">
                        <p className="text-lg font-semibold">
                            סכום: <span className="text-green-600">₪{total.toFixed(2)}</span>
                        </p>
                    </div>
                </div>
            )}

            {cart.products.length > 0 && (
                <div className="flex justify-end mt-6">
                    <button
                        onClick={async () => {
                            const res = await fetch("/api/order", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    products: cart.products.map((p) => ({
                                        productId: p.productId,
                                        name: p.name,
                                        barcode: p.barcode,
                                        quantity: p.quantity,
                                        selectedProvider: {
                                            name: p.selectedProvider.name,
                                            phone: p.selectedProvider.phone,
                                            price: p.selectedProvider.price,
                                        },
                                        availableProviders: p.availableProviders,
                                    })),
                                    notes: "", // 🔧 optionally add a textarea to collect notes
                                    status: "נוסף למערכת", // ✅ ensure default status
                                    createdAt: new Date().toISOString(),
                                }),
                            });

                            if (res.ok) {
                                await fetch("/api/cart", {
                                    method: "DELETE",
                                });
                                alert("✅ הזמנה נוצרה בהצלחה!");
                                router.push("/V2/orders");
                            } else {
                                alert("❌ נכשל ביצירת הזמנה");
                            }
                        }}
                        className="bg-green-600 text-white px-5 py-3 rounded shadow hover:bg-green-700 transition"
                    >
                        ביצוע הזמנה
                    </button>

                </div>
            )}
        </div>
    );
}
