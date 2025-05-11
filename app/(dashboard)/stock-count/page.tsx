"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

interface ProductType {
  _id: string;
  title: string;
  media: string[];
  quantity: number;
  location: string[];
}

export default function StockCountPage() {
  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [counted, setCounted] = useState<{ [id: string]: boolean }>({});
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const query = encodeURIComponent(searchValue.trim());
      const res = await fetch(`/api/stock/products?query=${query}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const markAsCounted = async (productId: string) => {
    try {
      await axios.post("/api/stock/count", {
        productId,
        date: new Date(),
      });
      setCounted((prev) => ({ ...prev, [productId]: true }));
    } catch (err) {
      console.error("Failed to update stock count:", err);
    }
  };

  useEffect(() => {
    if (!searchValue) {
      fetchProducts();
    }
  }, [searchValue]);

  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold text-right mb-6">ספירת מלאי</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="חיפוש לפי מזהה, שם, או מיקום"
          className="border rounded p-2 w-full text-right"
        />
        <button
          onClick={fetchProducts}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          חפש
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">אין תוצאות להצגה</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-4 flex flex-col items-end shadow bg-white"
            >
              <Image
                src={product.media?.[0] || "/no-image.png"}
                alt={product.title}
                width={100}
                height={100}
                className="rounded object-cover mb-3"
              />
              <Link
                href={`/products/${product._id}`}
                className="text-blue-600 font-bold hover:underline text-right"
              >
                {product.title}
              </Link>
              <p className="text-sm text-gray-600">כמות: {product.quantity}</p>
              <p className="text-sm text-gray-600">
                מיקומים: {product.location.join(", ")}
              </p>
              <label className="mt-3 inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!counted[product._id]}
                  onChange={() => markAsCounted(product._id)}
                  className="accent-blue-600"
                />
                <span className="text-sm">נספר</span>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
