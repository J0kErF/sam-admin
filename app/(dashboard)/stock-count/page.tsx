"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Product {
  _id: string;
  title: string;
  quantity: number;
  image: string;
  location: string[];
}

export default function StockCountPage() {
  const [locationQuery, setLocationQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [counted, setCounted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/location/${locationQuery}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCount = async (productId: string) => {
    try {
      await fetch("/api/stock/count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      setCounted((prev) => ({ ...prev, [productId]: true }));
    } catch (err) {
      console.error("Error updating count status:", err);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-right">בדיקת מלאי לפי מיקום</h1>

      <div className="flex gap-4 mb-6 justify-end">
        <input
          type="text"
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
          placeholder="הזן מיקום (לדוג' A-0-0)"
          className="border rounded px-4 py-2 w-full max-w-xs text-right"
        />
        <button
          onClick={fetchProducts}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          חפש
        </button>
      </div>

      {loading && <p className="text-center">טוען תוצאות...</p>}

      {!loading && products.length === 0 && (
        <p className="text-center text-gray-500">לא נמצאו פריטים במיקום הזה</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-xl p-4 shadow flex items-center gap-4 justify-between"
          >
            <div className="flex items-center gap-4">
              <Image
                src={product.image}
                alt={product.title}
                width={80}
                height={80}
                className="rounded object-cover"
              />
              <div className="text-right">
                <Link
                  href={`/products/${product._id}`}
                  className="text-blue-600 hover:underline block font-semibold"
                >
                  {product.title}
                </Link>
                <p className="text-sm text-gray-700">כמות: {product.quantity}</p>
                <p className="text-xs text-gray-500">מיקומים: {product.location.join(", ")}</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={!!counted[product._id]}
              onChange={() => handleToggleCount(product._id)}
              className="h-5 w-5 text-blue-600"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
