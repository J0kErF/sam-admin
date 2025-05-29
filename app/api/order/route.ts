import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { Order } from "@/lib/models/MOrder";

export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();
        const data = await req.json();

        if (!data.products || !Array.isArray(data.products) || data.products.length === 0) {
            return NextResponse.json({ message: "No products in the order" }, { status: 400 });
        }

        // 🔍 Validate each product structure
        for (const product of data.products) {
            if (
                !product.productId ||
                !product.name ||
                !product.barcode ||
                typeof product.quantity !== "number" ||
                !product.selectedProvider?.name ||
                typeof product.selectedProvider?.price !== "number" ||
                !Array.isArray(product.availableProviders)
            ) {
                return NextResponse.json({ message: "Invalid product format" }, { status: 400 });
            }
        }

        const newOrder = await Order.create({
            products: data.products,
            status: data.status || "added to the system",
            notes: data.notes || "",
            createdAt: new Date(),
        });

        return NextResponse.json(newOrder, { status: 201 });
    } catch (err: any) {
        console.error("❌ POST /api/order:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
};

export const PUT = async (req: NextRequest) => {
    try {
        await connectToDB();
        const { orderId, status, notes, products } = await req.json();

        const updatedFields: any = {};
        if (status) updatedFields.status = status;
        if (notes !== undefined) updatedFields.notes = notes;
        if (products) updatedFields.products = products;

        if (!orderId) {
            return NextResponse.json({ message: "Missing orderId" }, { status: 400 });
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, updatedFields, { new: true });


        if (!updatedOrder) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(updatedOrder, { status: 200 });
    } catch (err: any) {
        console.error("❌ PUT /api/order:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        await connectToDB();
        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json({ message: "Missing orderId" }, { status: 400 });
        }

        const deleted = await Order.findByIdAndDelete(orderId);

        if (!deleted) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Order deleted successfully" }, { status: 200 });
    } catch (err: any) {
        console.error("❌ DELETE /api/order:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
};

export const GET = async () => {
    try {
        await connectToDB();

        const orders = await Order.find().sort({ createdAt: -1 });

        return NextResponse.json(orders, { status: 200 });
    } catch (err: any) {
        console.error("❌ GET /api/order:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
};

export const dynamic = "force-dynamic";
