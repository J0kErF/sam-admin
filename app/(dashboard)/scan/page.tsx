"use client";

import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";

export default function QrCodeScanPage() {
  const qrRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!qrRef.current) return;

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
    },false);

    scanner.render(
      (decodedText) => {
        // Auto redirect here:
        if (decodedText.startsWith("http")) {
          window.location.href = decodedText; // redirect to full URL
        } else {
          router.push(`/products/${decodedText}`); // or adjust path as needed
        }

        scanner.clear(); // stop scanning
      },
      (error) => {
        // Optionally handle scan errors here
        console.warn(error);
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [router]);

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-xl font-bold mb-4">סרוק קוד QR</h1>
      <div id="qr-reader" ref={qrRef} className="w-full rounded shadow" />
    </div>
  );
}
