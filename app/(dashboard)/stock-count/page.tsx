"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
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
  const [showScanner, setShowScanner] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/stock/products?query=${encodeURIComponent(searchValue)}`);
      if (!res.ok) throw new Error("Failed to fetch");
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
        isCounted: true,
        date: new Date(),
      });
      setCounted((prev) => ({ ...prev, [productId]: true }));
    } catch (err) {
      console.error("Failed to update count status:", err);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchValue.trim()) {
        fetchProducts();
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchValue]);

  useEffect(() => {
    if (!searchValue) {
      fetchProducts();
    }
  }, []);

  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: 250,
      }, false);

      scanner.render(
        (decodedText) => {
          setSearchValue(decodedText);
          setShowScanner(false);
          scanner.clear();
        },
        (error) => console.warn("QR error:", error)
      );

      return () => {
        scanner.clear().catch(console.error);
      };
    }
  }, [showScanner]);

  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold text-right mb-6">ספירת מלאי</h1>

      <div className="flex gap-3 items-center mb-6">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="הכנס מזהה / שם / מיקום"
          className="border rounded p-2 w-full text-right"
        />

        <button
          onClick={() => setShowScanner(true)}
          className="bg-gray-200 text-sm p-2 rounded hover:bg-gray-300"
          title="סרוק QR"
        >
          📷
        </button>
      </div>

      {showScanner && (
        <div className="mb-6 border rounded p-4 bg-white shadow">
          <p className="mb-2 text-right font-medium">כוון את המצלמה לקוד QR</p>
          <div id="qr-reader" className="w-full max-w-md mx-auto" />
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-center text-gray-500">אין תוצאות</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-4 flex flex-col items-end shadow"
            >
              <Image
                src={product.media[0] || "/no-image.png"}
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
              <label className="mt-2 inline-flex items-center gap-2">
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
