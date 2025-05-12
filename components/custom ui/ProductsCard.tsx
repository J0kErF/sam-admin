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
  const qrSize = 30;
  const productsPerPage = 10;
  let productIndex = 0;

  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text(title.split("").reverse().join(""), pageWidth - 10, 20, {
    align: "right",
    maxWidth: 180,
  });

  try {
    const res = await fetch("/api/products");
    const products = await res.json();

    setProductCount(products.length);

    for (const product of products) {
      const name =
        typeof product.title === "string"
          ? product.title.trim().toUpperCase()
          : "ללא שם";
      const id = product._id || product.id || "ללא מזהה";

      if (productIndex > 0 && productIndex % productsPerPage === 0) {
        doc.addPage();
      }

      const itemOffset = 30 + (productIndex % productsPerPage) * 25;

      // Product Title
      doc.setFontSize(10);
      doc.text(name, pageWidth / 2, itemOffset, { align: "center" });

      // QR Code
      const qr = await QRCode.toDataURL(id.toString());
      doc.addImage(qr, "PNG", (pageWidth - qrSize) / 2, itemOffset + 3, qrSize, qrSize);

      // Product ID
      doc.setFontSize(8);
      doc.text(`ID: ${id}`, pageWidth / 2, itemOffset + qrSize + 10, {
        align: "center",
      });

      productIndex++;
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

      <p className="text-gray-500 text-sm mt-3">
        סהכ מוצרים: {productCount}
      </p>
    </div>
  );
};

export default ProductsCard;
