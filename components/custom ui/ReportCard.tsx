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

const ReportCard = ({ title, data, filename }: ReportCardProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const generatePDF = async () => {
    const doc = new jsPDF();
    let yOffset = 20;

    doc.setFontSize(16);
    doc.text(title, 14, yOffset);

    yOffset += 10;

    for (const item of data) {
      const qr = await QRCode.toDataURL(item._id || item.title);

      doc.setFont("Alef-Regular");
      doc.setFontSize(12);
      doc.text(`🆔 ${item._id}`, 14, yOffset);
      doc.text(`📦 ${item.title}`, 14, yOffset + 6);
      doc.text(`📉 כמות: ${item.quantity}`, 14, yOffset + 12);

      doc.addImage(qr, "PNG", 150, yOffset - 4, 30, 30);

      yOffset += 40;
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
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
