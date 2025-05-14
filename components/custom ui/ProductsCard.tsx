"use client";

import jsPDF from "jspdf";
import QRCode from "qrcode";
import { useState } from "react";

interface ReportCardProps {
  title: string;
  filename: string;
}

const ProductsCard = ({ title, filename }: ReportCardProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [productCount, setProductCount] = useState<number>(0);

  const generatePDF = async () => {
  setLoading(true);
  const doc = new jsPDF();
  doc.setFont("Alef-Regular");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const productsPerPage = 10;
  const qrSize = 30;
  const blockHeight = 65;
  const topMargin = 20;
  const blockStartY = topMargin + 10;

  try {
    const res = await fetch("/api/products");
    const products = await res.json();

    setProductCount(products.length);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const name =
        typeof product.title === "string"
          ? product.title.split("").reverse().join("")
          : "ללא שם";
      const id = product._id || product.id || "ללא מזהה";

      // Add new page every 10 products
      if (i > 0 && i % productsPerPage === 0) {
        doc.addPage();
      }

      const positionOnPage = i % productsPerPage;
      const y = blockStartY + positionOnPage * blockHeight;

      // Title
      doc.setFontSize(10);
      doc.text(name, pageWidth / 2, y, { align: "center" });

      // QR Code (for ID)
      const qr = await QRCode.toDataURL(id.toString());
      const qrX = (pageWidth - qrSize) / 2;
      doc.addImage(qr, "PNG", qrX, y + 5, qrSize, qrSize);

      // ID below QR
      doc.setFontSize(8);
      doc.text(`ID: ${id}`, pageWidth / 2, y + 5 + qrSize + 8, {
        align: "center",
      });
    }

    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);
    setPdfUrl(blobUrl);
    doc.save(`${filename}.pdf`);
  } catch (err) {
    console.error("Failed to generate product PDF:", err);
    alert("שגיאה ביצירת הדו\"ח");
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

    </div>
  );
};

export default ProductsCard;
