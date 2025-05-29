"use client"

import Loader from '@/components/custom ui/Loader'
import ProductForm from '@/components/products/ProductForm'
import React, { useEffect, useRef, useState } from 'react'
import { QRCodeSVG } from "qrcode.react";

const ProductDetails = ({ params }: { params: { productId: string }}) => {
  const [loading, setLoading] = useState(true)
  const [productDetails, setProductDetails] = useState<ProductType | null>(null)
  const qrRef = useRef<SVGSVGElement | null>(null);

  const getProductDetails = async () => {
    try { 
      const res = await fetch(`/api/products/${params.productId}`, {
        method: "GET"
      })
      const data = await res.json()
      setProductDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[productId_GET]", err)
    }
  }

  useEffect(() => {
    getProductDetails()
  }, [])

  const handleDownload = () => {
    if (!qrRef.current || !productDetails?.title) return;

    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height + 30;
    
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
    
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    
      ctx.fillStyle = "black";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(productDetails.title, canvas.width / 2, canvas.height - 10);
    
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${productDetails.title}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return loading ? <Loader /> : (
    <div className="flex flex-col gap-6">
      
      <div className="flex flex-col items-center gap-2 mt-6">
        <p className="text-sm text-gray-500">QR קוד למוצר</p>
        <QRCodeSVG ref={qrRef} value={params.productId} size={150} />
        <p className="text-xs text-gray-400 break-all">{params.productId}</p>
        <button
          onClick={handleDownload}
          className="mt-2 px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          הורד PNG
        </button>
      </div>
    </div>
  )
}

export default ProductDetails
