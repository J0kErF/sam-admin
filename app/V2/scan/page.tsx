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

  const controlsRef = useRef<IScannerControls | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const videoDevices = await BrowserMultiFormatReader.listVideoInputDevices();
        setDevices(videoDevices);

        // Try to find a device with label including "back" or "rear"
        const backCamera = videoDevices.find((d) =>
          d.label.toLowerCase().includes("back") ||
          d.label.toLowerCase().includes("rear")
        );

        setSelectedDeviceId(backCamera?.deviceId || videoDevices[0]?.deviceId || "");
      } catch (e: any) {
        setError("שגיאה בגישה למצלמות: " + e.message);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!selectedDeviceId || !videoRef.current) return;

    const codeReader = new BrowserMultiFormatReader(undefined, {
      delayBetweenScanAttempts: 150, // faster scanning
    });

    codeReaderRef.current = codeReader;

    codeReader
      .decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, error, controls) => {
          if (result && !isScanning) {
            const text = result.getText();
            setIsScanning(true);
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
      .catch((err) => {
        setError("שגיאה בהפעלת הסורק: " + err.message);
      });

    return () => {
      controlsRef.current?.stop();
    };
  }, [selectedDeviceId, router]);

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4 text-center">📷 סריקת ברקוד / QR</h1>

      {devices.length > 1 && (
        <div className="mb-4 w-full max-w-sm">
          <label className="block mb-2">בחר מצלמה:</label>
          <select
            value={selectedDeviceId}
            onChange={(e) => {
              setSelectedDeviceId(e.target.value);
              setIsScanning(false); // restart scan on camera change
              controlsRef.current?.stop();
            }}
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

      <div className="w-full max-w-sm aspect-[4/3] bg-gray-800 rounded overflow-hidden shadow-lg relative">
        <video
          ref={videoRef}
          className="absolute w-full h-full object-cover"
          muted
          playsInline
        />
      </div>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
}
