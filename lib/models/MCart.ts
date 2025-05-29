import mongoose, { Schema, Document, Types } from "mongoose";

interface SelectedProvider {
  name: string;
  phone: string;
  price: number;
}

interface AvailableProvider extends SelectedProvider {}

export interface ICartProduct extends Document {
  productId: Types.ObjectId | string;
  name: string;
  barcode: string;
  quantity: number;
  selectedProvider: SelectedProvider;
  availableProviders: AvailableProvider[];
}

export interface ICart extends Document {
  updatedAt: Date;
  products: ICartProduct[];
}

const ProviderSchema = new Schema<SelectedProvider>({
  name: { type: String, required: true },
  phone: { type: String, required: false },
  price: { type: Number, required: false },
}, { _id: false });

const CartProductSchema = new Schema<ICartProduct>({
  productId: { type: Schema.Types.Mixed, required: true },
  name: { type: String, required: true },
  barcode: { type: String, required: false },
  quantity: { type: Number, required: true },
  selectedProvider: { type: ProviderSchema, required: true },
  availableProviders: { type: [ProviderSchema], default: [] },
}, { _id: false });

const CartSchema = new Schema<ICart>({
  updatedAt: { type: Date, default: Date.now },
  products: { type: [CartProductSchema], default: [] }
});

export const Cart =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
