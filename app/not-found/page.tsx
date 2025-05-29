// app/not-found/page.tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function NotFoundPage() {
  const path = usePathname();

  useEffect(() => {
    console.warn(`🚫 404 - Page not found: ${path}`);
  }, [path]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      <h1 className="text-7xl font-bold text-blue-700 drop-shadow">404</h1>
      <p className="text-2xl mt-4 text-gray-700">הדף שחיפשת לא נמצא 😢</p>
      <p className="text-sm text-gray-500 mt-2">
        כתובת שגויה: <code className="bg-white px-2 py-1 rounded">{path}</code>
      </p>
      <Link
        href="/"
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition duration-200"
      >
        חזרה לדף הבית
      </Link>
    </div>
  );
}
