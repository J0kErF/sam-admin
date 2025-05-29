import mongoose, { Schema, Document } from "mongoose";

export interface OrderProduct {
  productId: string;
  name: string;
  barcode: string;
  quantity: number;
  selectedProvider: {
    name: string;
    phone: string;
    price: number;
  };
  availableProviders: {
    name: string;
    phone: string;
    price: number;
  }[];
}

export interface IOrder extends Document {
  status: string;
  notes: string;
  createdAt: Date;
  products: OrderProduct[];
}

const ProviderSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const OrderProductSchema = new Schema<OrderProduct>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    barcode: { type: String, required: true },
    quantity: { type: Number, required: true },
    selectedProvider: { type: ProviderSchema, required: true },
    availableProviders: { type: [ProviderSchema], default: [] },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    status: { type: String, default: "added to the system", required: true },
    notes: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    products: { type: [OrderProductSchema], required: true },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
