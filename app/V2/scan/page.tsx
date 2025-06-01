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
      delayBetweenScanAttempts: 100, // Fast scan
    });
    codeReaderRef.current = codeReader;

    setIsScanning(false);

    codeReader
      .decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, error, controls) => {
          if (result && !isScanning) {
            const text = result.getText();
            setIsScanning(true);
            controls.stop();
            controlsRef.current = controls;

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
      .catch((err) => {
        setError("שגיאה בהפעלת הסורק: " + err.message);
      });

    return () => {
      controlsRef.current?.stop();
    };
  }, [selectedDeviceId, router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center justify-start">
      <h1 className="text-2xl font-bold mb-4 text-center">📷 סריקת ברקוד / QR</h1>

      {devices.length > 1 && (
        <div className="mb-4 w-full max-w-sm">
          <label className="block mb-2 text-lg font-medium">בחר מצלמה:</label>
          <select
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className="w-full p-3 rounded text-black"
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `מצלמה ${device.deviceId.slice(-4)}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="relative w-full max-w-sm aspect-[4/3] bg-black rounded overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          className="absolute w-full h-full object-cover"
          playsInline
          muted
        />
      </div>

      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

      <p className="mt-6 text-sm text-gray-300 text-center">מקם את הברקוד במרכז המסך לסריקה אוטומטית</p>
    </div>
  );
}
