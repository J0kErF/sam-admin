import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";

const getCorsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin || "*", // or whitelist your frontend origin
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
});

export const OPTIONS = async (req: NextRequest) => {
  const origin = req.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
};

export const POST = async (req: NextRequest) => {
  const origin = req.headers.get("origin");

  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: getCorsHeaders(origin),
      });
    }

    await connectToDB();

    const {
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      location,
      price,
      quantity,
    } = await req.json();

    if (!title || !description || !media || !category || !price || quantity === undefined) {
      return new NextResponse("Not enough data to create a product", {
        status: 400,
        headers: getCorsHeaders(origin),
      });
    }

    const newProduct = await Product.create({
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      location, // ✅ use new name
      price,
      quantity,  // ✅ use new name
    });

    await newProduct.save();

    if (collections) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId);
        if (collection) {
          collection.products.push(newProduct._id);
          await collection.save();
        }
      }
    }

    return NextResponse.json(newProduct, {
      status: 200,
      headers: getCorsHeaders(origin),
    });
  } catch (err) {
    console.log("[products_POST]", err);
    return new NextResponse("Internal Error", {
      status: 500,
      headers: getCorsHeaders(origin),
    });
  }
};


export const GET = async (req: NextRequest) => {
  const origin = req.headers.get("origin");

  try {
    await connectToDB();

    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .populate({ path: "collections", model: Collection });

    return NextResponse.json(products, {
      status: 200,
      headers: getCorsHeaders(origin),
    });
  } catch (err) {
    console.log("[products_GET]", err);
    return new NextResponse("Internal Error", {
      status: 500,
      headers: getCorsHeaders(origin),
    });
  }
};

export const dynamic = "force-dynamic";
