"use client";

import jsPDF from "jspdf";
import QRCode from "qrcode";
import { useState } from "react";

interface ReportCardProps {
    title: string;
    filename: string;
}
var uniqueLocationcount = 0;
const LocationReportCard = ({ title, filename }: ReportCardProps) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const generatePDF = async () => {
        setLoading(true);
        const doc = new jsPDF();
        doc.setFont("Alef-Regular");
        let yOffset = 30;

        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text(title.split("").reverse().join(""), 200, yOffset, {
            align: "right",
            maxWidth: 180,
        });

        yOffset += 15;

        try {
            // 1. Fetch all products with locations
            const res = await fetch("/api/products");
            const products = await res.json();
            const allLocations = products.flatMap((p: any) => p.location || []);


            // 2. Unique and sorted locationsconst upperLocations = allLocations
            const upperLocations = allLocations.map((loc: any) =>
                typeof loc === "string" ? loc.toUpperCase() : ""
            );
            const uniqueLocations = Array.from(new Set(upperLocations)).sort();



            // 3. Render each QR + location text
            for (const location of uniqueLocations) {
                if (typeof location !== "string") continue; // Ensure location is a string
                const qr = await QRCode.toDataURL(location);
                uniqueLocationcount += 1;
                if (yOffset > 250) {
                    doc.addPage();
                    yOffset = 30;
                }

                doc.addImage(qr, "PNG", 80, yOffset, 50, 50);
                yOffset += 55;

                doc.setFontSize(12);
                doc.text(location, 105, yOffset, { align: "center" });
                yOffset += 20;
            }

            const blob = doc.output("blob");
            const blobUrl = URL.createObjectURL(blob);
            setPdfUrl(blobUrl);
            doc.save(`${filename}.pdf`);
        } catch (err) {
            console.error("Failed to generate location QR PDF:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md border">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>

            <div className="flex items-center gap-4 mt-4">
                <button
                    onClick={generatePDF}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
                    disabled={loading}
                >
                    {loading ? "יוצר..." : "הורד"}
                </button>

                {pdfUrl && (
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                    >
                        פתח
                    </a>
                )}
            </div>

            <p className="text-gray-500 text-sm mt-3">
                סהכ מיקומים {uniqueLocationcount}
            </p>
        </div>
    );
};

export default LocationReportCard;
