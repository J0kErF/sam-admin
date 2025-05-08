"use client"

import Loader from '@/components/custom ui/Loader'
import ProductForm from '@/components/products/ProductForm'
import React, { useEffect, useState } from 'react'
import { QRCodeSVG } from "qrcode.react";

const ProductDetails = ({ params }: { params: { productId: string }}) => {
  const [loading, setLoading] = useState(true)
  const [productDetails, setProductDetails] = useState<ProductType | null>(null)

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

  return loading ? <Loader /> : (
    <div className="flex flex-col gap-6">
      <ProductForm initialData={productDetails} />
      <div className="flex flex-col items-center gap-2 mt-6">
        <p className="text-sm text-gray-500">QR קוד למוצר</p>
        <QRCodeSVG value={params.productId} size={150} />
        <p className="text-xs text-gray-400 break-all">{params.productId}</p>
      </div>
    </div>
  )
}

export default ProductDetails