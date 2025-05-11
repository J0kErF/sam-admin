"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function QrCodeScanPage() {
  const qrRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    if (!qrRef.current) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        if (decodedText.startsWith("http")) {
          window.location.href = decodedText;
        } else {
          router.push(`/products/${decodedText}`);
        }
        scanner.clear();
        setScanning(false);
      },
      (error) => {
        // You can show the error or ignore it for smoother UX
        console.warn("QR scan error:", error);
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [router]);

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">סריקת קוד QR</h1>
        <p className="text-gray-500 text-sm mt-2">
          הכנס את הקוד לתוך הריבוע והמתן לזיהוי אוטומטי
        </p>
      </div>

      <div
        id="qr-reader"
        ref={qrRef}
        className="w-full max-w-sm rounded-lg border border-gray-300 shadow-md"
      />

      {scanning && (
        <div className="mt-6 flex items-center gap-2 text-blue-600 animate-pulse">
          <Loader className="w-5 h-5 animate-spin" />
          <span>ממתין לסריקה...</span>
        </div>
      )}
    </div>
  );
}
