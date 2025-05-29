import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { Cart } from "@/lib/models/MCart";

export const GET = async () => {
    try {
        await connectToDB();
        const cart = await Cart.findOne().sort({ updatedAt: -1 });
        return NextResponse.json(cart || { updatedAt: new Date().toISOString(), products: [] });
    } catch (error: any) {
        console.error("❌ GET /api/cart:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ message: "Missing productId" }, { status: 400 });
        }

        await connectToDB();

        let cart = await Cart.findOne();
        if (!cart) {
            cart = await Cart.create({
                updatedAt: new Date(),
                products: [body],
            });
        } else {
             const index = cart.products.findIndex((p: any) =>
            p.productId === body.productId &&
            p.selectedProvider?.name === body.selectedProvider?.name
        );
            if (index !== -1) {
                cart.products[index] = body;
            } else {
                cart.products.push(body);
            }
            cart.updatedAt = new Date();
            await cart.save();
        }

        return NextResponse.json(cart);
    } catch (error: any) {
        console.error("❌ POST /api/cart:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
};

export const PUT = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ message: "Missing productId" }, { status: 400 });
        }

        await connectToDB();
        const cart = await Cart.findOne();

        if (!cart) {
            return NextResponse.json({ message: "Cart not found" }, { status: 404 });
        }
        const index = cart.products.findIndex((p: any) =>
            p.productId === body.productId &&
            p.selectedProvider?.name === body.selectedProvider?.name
        );

        if (index !== -1) {
            cart.products[index] = body;
            cart.updatedAt = new Date();
            await cart.save();
            return NextResponse.json(cart);
        } else {
            return NextResponse.json({ message: "Product not found in cart" }, { status: 404 });
        }
    } catch (error: any) {
        console.error("❌ PUT /api/cart:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
};
/*
export const DELETE = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { productId, providerName } = body;

    if (!productId || !providerName) {
      return NextResponse.json({ message: "Missing productId or providerName" }, { status: 400 });
    }

    await connectToDB();
    const cart = await Cart.findOne();

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const initialLength = cart.products.length;

    cart.products = cart.products.filter(
      (p: any) =>
        !(p.productId === productId && p.selectedProvider?.name === providerName)
    );

    if (cart.products.length === initialLength) {
      return NextResponse.json(
        { message: "No matching product-provider combo found in cart" },
        { status: 404 }
      );
    }

    cart.updatedAt = new Date();
    await cart.save();

    return NextResponse.json(cart);
  } catch (error: any) {
    console.error("❌ DELETE /api/cart:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
*/
export const DELETE = async (req: NextRequest) => {
  try {
    const text = await req.text();
    const body = text ? JSON.parse(text) : null;

    await connectToDB();
    const cart = await Cart.findOne();
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    // ❗ Clear all products if no body was sent (full drop)
    if (!body) {
      cart.products = [];
      cart.updatedAt = new Date();
      await cart.save();
      return NextResponse.json({ message: "Cart cleared" });
    }

    // 🔍 Proceed with removing specific product
    const { productId, providerName } = body;
    if (!productId || !providerName) {
      return NextResponse.json({ message: "Missing productId or providerName" }, { status: 400 });
    }

    const initialLength = cart.products.length;
    cart.products = cart.products.filter(
      (p: any) =>
        !(p.productId === productId && p.selectedProvider?.name === providerName)
    );

    if (cart.products.length === initialLength) {
      return NextResponse.json(
        { message: "No matching product-provider combo found in cart" },
        { status: 404 }
      );
    }

    cart.updatedAt = new Date();
    await cart.save();

    return NextResponse.json(cart);
  } catch (error: any) {
    console.error("❌ DELETE /api/cart:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};


export const dynamic = "force-dynamic";
