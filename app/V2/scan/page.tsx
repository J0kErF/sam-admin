"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { useRouter } from "next/navigation";

export default function BarcodeScannerPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState("");
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const router = useRouter();
    const controlsRef = useRef<any>(null);

    useEffect(() => {
        const loadDevices = async () => {
            const foundDevices = await BrowserMultiFormatReader.listVideoInputDevices();
            setDevices(foundDevices);
            const backCamera = foundDevices.find((d) =>
                d.label.toLowerCase().includes("back")
            );
            setSelectedDeviceId(backCamera?.deviceId || foundDevices[0]?.deviceId || null);
        };

        loadDevices();
    }, []);

    useEffect(() => {
        if (!selectedDeviceId || !videoRef.current) return;

        const codeReader = new BrowserMultiFormatReader();

        // Set up barcode type hints
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
            BarcodeFormat.QR_CODE,
            BarcodeFormat.DATA_MATRIX,
            BarcodeFormat.AZTEC,
            BarcodeFormat.PDF_417,
            BarcodeFormat.EAN_13,
            BarcodeFormat.EAN_8,
            BarcodeFormat.UPC_A,
            BarcodeFormat.UPC_E,
            BarcodeFormat.CODE_39,
            BarcodeFormat.CODE_93,
            BarcodeFormat.CODE_128,
            BarcodeFormat.ITF,
            BarcodeFormat.RSS_14,
            BarcodeFormat.RSS_EXPANDED,
        ]);

        codeReader.setHints(hints);

        codeReader
            .decodeFromVideoDevice(
                selectedDeviceId,
                videoRef.current,
                (result, err, controls) => {
                    if (result) {
                        const text = result.getText();
                        controls.stop();
                        if (text.startsWith("http")) {
                            window.location.href = text;
                        } else {
                            router.push(`/V2/parts?query=${encodeURIComponent(text)}`);
                        }
                    }
                }
            )
            .then((controls) => {
                controlsRef.current = controls;
            })
            .catch((e) => setError("שגיאה בסריקה: " + e.message));

        return () => {
            controlsRef.current?.stop?.();
        };
    }, [selectedDeviceId]);

    return (
        <div className="max-w-md mx-auto p-6 text-center">
            <h1 className="text-xl font-bold mb-4">📷 סריקת ברקוד / QR</h1>

            {/* Camera Selector */}
            <select
                value={selectedDeviceId || ""}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="mb-4 p-2 border rounded"
            >
                {devices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                        {device.label || "מצלמה"}
                    </option>
                ))}
            </select>

            <video ref={videoRef} className="w-full rounded shadow" />
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
