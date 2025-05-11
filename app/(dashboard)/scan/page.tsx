"use client";

import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";

export default function QrCodeScanPage() {
  const qrRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!qrRef.current) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250,
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

        scanner.clear(); // stop scanning
      },
      (error) => {
        console.warn(error);
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [router]);

  // ✨ Custom UI Texts
  useEffect(() => {
    const customizeUI = () => {
      const dropdown = document.querySelector("#qr-reader__dashboard select");
      if (dropdown) dropdown.previousSibling!.textContent = "בחר מצלמה";

      const scanButton = document.querySelector(
        "#qr-reader__dashboard button"
      ) as HTMLButtonElement;
      if (scanButton) scanButton.textContent = "התחל סריקה";

      const upload = document.querySelector(
        "#qr-reader__dashboard a"
      ) as HTMLAnchorElement;
      if (upload) upload.textContent = "סרוק תמונה";
    };

    const interval = setInterval(() => {
      if (document.querySelector("#qr-reader__dashboard")) {
        customizeUI();
        clearInterval(interval);
      }
    }, 200);
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-xl font-bold mb-4">סרוק קוד QR</h1>
      <div id="qr-reader" ref={qrRef} className="w-full rounded shadow" />
    </div>
  );
}
