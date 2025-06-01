"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { useRouter } from "next/navigation";

export default function BarcodeScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const availableDevices = await BrowserMultiFormatReader.listVideoInputDevices();
        setDevices(availableDevices);
        if (availableDevices.length > 0) {
          setSelectedDeviceId(availableDevices[0].deviceId);
        } else {
          setError("לא נמצאו מצלמות.");
        }
      } catch (e: any) {
        setError("שגיאה בגישה למצלמות: " + e.message);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!selectedDeviceId || !videoRef.current) return;

    const codeReader = new BrowserMultiFormatReader(undefined, {
      delayBetweenScanAttempts: 100, // ✅ Faster scanning
    });
    codeReaderRef.current = codeReader;

    setIsScanning(false); // reset scanning status

    codeReader
      .decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, error, controls) => {
          if (result && !isScanning) {
            const text = result.getText();
            console.log("Scanned:", text);

            setIsScanning(true); // prevent double scans
            controls.stop();
            controlsRef.current = controls;

            if (text.startsWith("http")) {
              window.location.href = text;
            } else {
              router.push(`/V2/parts?query=${encodeURIComponent(text)}`);
            }
          } else if (error) {
            // silent scan fail
          }
        }
      )
      .then((controls) => {
        controlsRef.current = controls;
      })
      .catch((err) => {
        console.error("Scanner init error:", err);
        setError("שגיאה בהפעלת הסורק: " + err.message);
      });

    return () => {
      controlsRef.current?.stop();
    };
  }, [selectedDeviceId, router]);

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-xl font-bold mb-4">📷 סרוק ברקוד / QR</h1>

      {devices.length > 1 && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">בחר מצלמה:</label>
          <select
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className="border p-2 rounded w-full"
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `מצלמה ${device.deviceId.slice(-4)}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <video ref={videoRef} className="w-full rounded shadow" />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
