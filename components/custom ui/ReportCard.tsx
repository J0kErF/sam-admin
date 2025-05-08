"use client"

import jsPDF from "jspdf";
import "@/lib/fonts/hebrew-font"; // adjust path

import QRCode from "qrcode";
import { useState } from "react";

interface ReportCardProps {
    title: string;
    data: any[];
    filename: string;
}
const loadImageAsDataUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
  
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
const ReportCard = ({ title, data, filename }: ReportCardProps) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const generatePDF = async () => {
        const doc = new jsPDF();
        doc.setFont("Alef-Regular");
        let yOffset = 30;

        // Page title
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text(title.split("").reverse().join(""), 200, yOffset, {
            align: "right",
            maxWidth: 180,
        });

        yOffset += 15;

        for (const item of data) {
            if (yOffset > 260) {
              doc.addPage();
              yOffset = 30;
            }
          
            const qr = await QRCode.toDataURL(item._id || item.title);
            const productImage = item.image ? await loadImageAsDataUrl(item.image) : null;
          
            // Card box
            doc.setDrawColor(220);
            doc.setLineWidth(0.2);
            doc.roundedRect(10, yOffset - 5, 190, 40, 2, 2, "S");
          
            // Text content (RTL)
            doc.setFontSize(12);
            doc.setTextColor(20, 20, 20);
            doc.text(`🆔 ${item._id}`, 180, yOffset + 5, { align: "right" });
            doc.text(`📦 ${item.title}`, 180, yOffset + 12, { align: "right" });
            doc.text(`📉 כמות: ${item.quantity}`, 180, yOffset + 19, { align: "right" });
          
            // QR Code
            doc.addImage(qr, "PNG", 14, yOffset, 24, 24);
          
            // Product Image (if exists)
            if (productImage) {
              doc.addImage(productImage, "JPEG", 44, yOffset, 24, 24);
            }
          
            yOffset += 50;
          }
          
        const blob = doc.output("blob");
        const blobUrl = URL.createObjectURL(blob);
        setPdfUrl(blobUrl);

        doc.save(`${filename}.pdf`);
    };


    return (
        <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md border">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>

            <div className="flex items-center gap-4 mt-4">
                <button
                    onClick={generatePDF}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
                >
                    הורד
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
                סה״כ: {data.length} פריטים
            </p>
        </div>
    );
};

export default ReportCard;
