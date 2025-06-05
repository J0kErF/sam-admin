"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export type OrderProduct = {
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

export type Order = {
    _id: string;
    createdAt: string;
    status: string;
    notes?: string;
    products: OrderProduct[];
};

const STATUS_OPTIONS = [
    "נוסף למערכת",
    "ההזמנה נשלחה לספקים",
    "קיבלנו את ההזמנה",
    "בוצע תשלום",
    "ההזמנה הוחזרה",
    "ההזמנה בוטלה"
];

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [editedOrder, setEditedOrder] = useState<Order | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/order")
            .then((res) => res.json())
            .then((data) => {
                setOrders(
                    data.sort(
                        (a: Order, b: Order) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                );
            });
    }, []);

    const updateOrder = async (orderId: string, updates: Partial<Order>) => {
        const res = await fetch("/api/order", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, ...updates }),
        });
        if (res.ok) {
            const updated = await res.json();
            setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
            setSelectedOrder(null);
            setEditedOrder(null);
        }
    };

    const deleteOrder = async (orderId: string) => {
        const confirmed = confirm("Are you sure you want to delete this order?");
        if (!confirmed) return;

        const res = await fetch("/api/order", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId }),
        });
        if (res.ok) {
            setOrders((prev) => prev.filter((o) => o._id !== orderId));
        }
    };

    const handleEditClick = (order: Order) => {
        setSelectedOrder(order);
        setEditedOrder(JSON.parse(JSON.stringify(order)));
    };

    const fetchProviderPhone = async (providerName: string) => {
        try {
            const res = await fetch(`/api/providers/by-name?name=${encodeURIComponent(providerName)}`);
            const data = await res.json();
            return data?.provider?.phoneNumber || "";
        } catch {
            return "";
        }
    };
    function formatPhoneToInternational(phone: string): string {
        // מסיר רווחים, מקפים, וסוגריים
        const cleaned = phone.replace(/[^\d]/g, '');

        if (cleaned.startsWith("0")) {
            return `+972${cleaned.slice(1)}`;
        }

        if (cleaned.startsWith("972")) {
            return `+${cleaned}`;
        }

        // במידה והמספר כבר בפורמט תקני
        return phone;
    }

    const generateWhatsAppLink = async (providerName: string, items: OrderProduct[]) => {
        const Pphone = await fetchProviderPhone(providerName).catch(() => "");
        if (!Pphone) {
            // error
            alert("לא ניתן למצוא את מספר הטלפון של הספק");
            return "";
        }
        const phone = formatPhoneToInternational(Pphone);
        if (!items || items.length === 0) {
            alert("אין פריטים להזמין");
            return "";
        }
        if (items.some(item => !item.name || !item.barcode || item.quantity <= 0)) {
            alert("יש לוודא שכל הפריטים מכילים שם, ברקוד וכמות תקינה");
            return "";
        }

        const message = `שלום, רוצה להזמין את החלקים:\n\n` +
            items.map((item, index) =>
                `* ${item.name}\nברקוד: ${item.barcode}\nכמות: ${item.quantity}`
            ).join("\n\n");
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">📦 הזמנות</h1>
            <div className="space-y-8">
                {orders.map((order) => {
                    const groupedByProvider: Record<string, OrderProduct[]> = {};
                    order.products.forEach((product) => {
                        const key = product.selectedProvider.name;
                        if (!groupedByProvider[key]) groupedByProvider[key] = [];
                        groupedByProvider[key].push(product);
                    });

                    return (
                        <div key={order._id} className="bg-white p-5 rounded-xl shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">הזמנה #{order._id.slice(-6)}</h2>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">{format(new Date(order.createdAt), "PPpp")}</span>
                                    <button className="text-blue-600 hover:underline text-sm" onClick={() => handleEditClick(order)}>ערוך</button>
                                    <button className="text-red-600 hover:underline text-sm" onClick={() => deleteOrder(order._id)}>מחק</button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-2"><strong>סטטוס:</strong> {order.status}</p>
                            <p className="text-sm text-gray-600 mb-4"><strong>הערות:</strong> {order.notes || "לא נמסרו הערות"}</p>

                            {Object.entries(groupedByProvider).map(([provider, items], i) => (
                                <div key={i} className="border rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-sm font-medium text-gray-800">ספק: <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => router.push(`/V2/providers`)}>{provider}</span></h4>
                                        <button
                                            onClick={async () => {
                                                const link = await generateWhatsAppLink(provider, items);
                                                window.open(link, "_blank");
                                            }}
                                            className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700"
                                        >
                                            שלח בואטסאפ
                                        </button>
                                    </div>
                                    <div className="divide-y">
                                        {items.map((item, idx) => (
                                            <div key={idx} className="py-2 flex justify-between text-sm">
                                                <div>
                                                    <p className="text-blue-600 cursor-pointer hover:underline font-medium" onClick={() => router.push(`/V2/parts/${item.productId}`)}>{item.name}</p>
                                                    <p className="text-xs text-gray-500">ברקוד: {item.barcode}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p>כמות: {item.quantity}</p>
                                                    <p>₪{item.selectedProvider.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                    );

                })}
            </div>
            {editedOrder && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-50 overflow-auto">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4">✏️ עריכת הזמנה מלאה</h2>

                        {/* 🟡 Edit Status */}
                        <div className="mb-4">
                            <label className="block text-sm text-gray-700 mb-1">סטטוס</label>
                            <select
                                className="border p-2 w-full rounded"
                                value={editedOrder.status}
                                onChange={(e) => setEditedOrder({ ...editedOrder, status: e.target.value })}
                            >
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        {/* 🟡 Edit Notes */}
                        <div className="mb-4">
                            <label className="block text-sm text-gray-700 mb-1">הערות</label>
                            <textarea
                                className="border p-2 w-full rounded"
                                value={editedOrder.notes || ""}
                                onChange={(e) => setEditedOrder({ ...editedOrder, notes: e.target.value })}
                            />
                        </div>

                        {/* 🟢 Edit Each Product */}
                        <h3 className="text-sm font-semibold mb-2">פריטים:</h3>
                        <div className="space-y-4">
                            {editedOrder.products.map((product, idx) => (
                                <div
                                    key={idx}
                                    className="relative border rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
                                >
                                    {/* ❌ Remove Button - top right */}
                                    <button
                                        onClick={() => {
                                            const updated = editedOrder.products.filter((_, i) => i !== idx);
                                            setEditedOrder({ ...editedOrder, products: updated });
                                        }}
                                        className="absolute top-2 right-2 text-red-600 hover:text-red-800 bg-white rounded-full p-1 shadow"
                                        title="הסר פריט"
                                    >
                                        ❌
                                    </button>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs mb-1">שם חלק</label>
                                            <input
                                                type="text"
                                                className="border rounded w-full p-2 text-sm"
                                                value={product.name}
                                                onChange={(e) => {
                                                    const updated = [...editedOrder.products];
                                                    updated[idx].name = e.target.value;
                                                    setEditedOrder({ ...editedOrder, products: updated });
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs mb-1">ברקוד</label>
                                            <input
                                                type="text"
                                                className="border rounded w-full p-2 text-sm"
                                                value={product.barcode}
                                                onChange={(e) => {
                                                    const updated = [...editedOrder.products];
                                                    updated[idx].barcode = e.target.value;
                                                    setEditedOrder({ ...editedOrder, products: updated });
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs mb-1">כמות</label>
                                            <input
                                                type="number"
                                                className="border rounded w-full p-2 text-sm"
                                                value={product.quantity}
                                                onChange={(e) => {
                                                    const updated = [...editedOrder.products];
                                                    updated[idx].quantity = parseInt(e.target.value);
                                                    setEditedOrder({ ...editedOrder, products: updated });
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs mb-1">מחיר</label>
                                            <input
                                                type="number"
                                                className="border rounded w-full p-2 text-sm"
                                                value={product.selectedProvider.price}
                                                onChange={(e) => {
                                                    const updated = [...editedOrder.products];
                                                    updated[idx].selectedProvider.price = parseFloat(e.target.value);
                                                    setEditedOrder({ ...editedOrder, products: updated });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>

                        {/* 🔵 Save / Cancel */}
                        <div className="flex justify-between mt-6">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
                                onClick={() => {
                                    setEditedOrder(null);
                                    setSelectedOrder(null);
                                }}
                            >
                                ביטול
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={() =>
                                    updateOrder(editedOrder._id, {
                                        status: editedOrder.status,
                                        notes: editedOrder.notes,
                                        products: editedOrder.products,
                                    })
                                }
                            >
                                שמור שינויים
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
