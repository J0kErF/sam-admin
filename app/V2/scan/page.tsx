"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useRouter } from "next/navigation";

export default function BarcodeScannerPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState("");
    const router = useRouter();
    const controlsRef = useRef<any>(null); // We'll save the returned controls here

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        const startScan = async () => {
            try {
                const devices = await BrowserMultiFormatReader.listVideoInputDevices();
                if (devices.length === 0) {
                    setError("לא נמצאו מצלמות");
                    return;
                }

                const selectedDeviceId = devices[0].deviceId;

                // ✅ Save the returned controls so we can stop later
                const controls = await codeReader.decodeFromVideoDevice(
                    selectedDeviceId,
                    videoRef.current!,
                    (result, error) => {
                        if (result) {
                            const text = result.getText();
                            console.log("Scanned:", text);

                            controls.stop(); // ✅ Stop scanning properly

                            if (text.startsWith("http")) {
                                window.location.href = text;
                            } else {
                                router.push(`/V2/parts?query=${encodeURIComponent(text)}`);
                            }

                        } else if (error) {
                            console.warn("Scan error:", error);
                        }
                    }
                );

                controlsRef.current = controls;
            } catch (e: any) {
                setError("שגיאה בהפעלת הסורק: " + e.message);
            }
        };

        startScan();

        return () => {
            if (controlsRef.current) {
                controlsRef.current.stop(); // ✅ Proper stop on unmount
            }
        };
    }, [router]);

    return (
        <div className="max-w-md mx-auto p-6 text-center">
            <h1 className="text-xl font-bold mb-4">📷 סריקת ברקוד / QR</h1>
            <video ref={videoRef} className="w-full rounded shadow" />
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
