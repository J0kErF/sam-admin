// app/V2/orders/page.tsx

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
                                <h2 className="text-xl font-semibold text-gray-800">
                                    הזמנה #{order._id.slice(-6)}
                                </h2>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">
                                        {format(new Date(order.createdAt), "PPpp")}
                                    </span>
                                    <button
                                        className="text-blue-600 hover:underline text-sm"
                                        onClick={() => handleEditClick(order)}
                                    >
                                        ערוך
                                    </button>
                                    <button
                                        className="text-red-600 hover:underline text-sm"
                                        onClick={() => deleteOrder(order._id)}
                                    >
                                        מחק
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                                <strong>סטטוס:</strong> {order.status}
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                                <strong>הערות:</strong> {order.notes || "לא נמסרו הערות"}
                            </p>

                            {Object.entries(groupedByProvider).map(([provider, items], i) => (
                                <div key={i} className="border rounded-lg p-4 mb-4">
                                    <h4 className="text-sm font-medium text-gray-800 mb-2">
                                        ספק: <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => router.push(`/V2/providers`)}>{provider}</span>
                                    </h4>
                                    <div className="divide-y">
                                        {items.map((item, idx) => (
                                            <div key={idx} className="py-2 flex justify-between text-sm">
                                                <div>
                                                    <p
                                                        className="text-blue-600 cursor-pointer hover:underline font-medium"
                                                        onClick={() => router.push(`/V2/parts/${item.productId}`)}
                                                    >
                                                        {item.name}
                                                    </p>
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

            {/* Edit Modal remains unchanged */}
            {selectedOrder && editedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">עריכת הזמנה #{selectedOrder._id.slice(-6)}</h3>

                        <label className="block mb-2 text-sm font-medium">סטטוס</label>
                        <select
                            className="w-full p-2 border rounded mb-4"
                            value={editedOrder.status}
                            onChange={(e) => setEditedOrder({ ...editedOrder, status: e.target.value })}
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>

                        <label className="block mb-2 text-sm font-medium">הערות</label>
                        <textarea
                            className="w-full p-2 border rounded mb-4"
                            value={editedOrder.notes || ""}
                            onChange={(e) => setEditedOrder({ ...editedOrder, notes: e.target.value })}
                        />

                        {editedOrder.products.map((p, idx) => (
                            <div key={idx} className="mb-4 border p-3 rounded">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="font-semibold text-blue-600 cursor-pointer" onClick={() => router.push(`/V2/parts/${p.productId}`)}>{p.name}</p>
                                        <p className="text-xs text-gray-500">ברקוד: {p.barcode}</p>
                                        <p className="text-xs text-gray-700">ספק: {p.selectedProvider.name}</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <label className="block text-xs">כמות</label>
                                        <input
                                            type="number"
                                            className="border p-1 rounded w-20 text-right"
                                            value={p.quantity}
                                            onChange={(e) => {
                                                const quantity = parseInt(e.target.value);
                                                const updatedProducts = [...editedOrder.products];
                                                updatedProducts[idx].quantity = quantity;
                                                setEditedOrder({ ...editedOrder, products: updatedProducts });
                                            }}
                                        />
                                        <label className="block text-xs">מחיר</label>
                                        <input
                                            type="number"
                                            className="border p-1 rounded w-20 text-right"
                                            value={p.selectedProvider.price}
                                            onChange={(e) => {
                                                const price = parseFloat(e.target.value);
                                                const updatedProducts = [...editedOrder.products];
                                                updatedProducts[idx].selectedProvider.price = price;
                                                setEditedOrder({ ...editedOrder, products: updatedProducts });
                                            }}
                                        />
                                        <button
                                            onClick={() => {
                                                const updatedProducts = editedOrder.products.filter(
                                                    (x) => !(x.productId === p.productId && x.selectedProvider.name === p.selectedProvider.name)
                                                );
                                                setEditedOrder({ ...editedOrder, products: updatedProducts });
                                            }}
                                            className="text-red-600 hover:underline text-xs mt-2"
                                        >
                                            הסר
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => {
                                    setSelectedOrder(null);
                                    setEditedOrder(null);
                                }}
                            >
                                ביטול
                            </button>
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded"
                                onClick={() => updateOrder(editedOrder._id, editedOrder)}
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
