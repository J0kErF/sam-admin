import mongoose, { Schema, Document } from "mongoose";

interface ProviderEntry {
  providerName: string;
  price: number;
  barcode: string;
  quantity: number;
  location: string;
}

export interface IPart extends Document {
  name: string;
  modelYears: number[];
  carCompanies: string[];
  subMake: string;
  sellPrice: number;
  category: string;
  media: string[];
  providers: ProviderEntry[];
  companyBarcode?: string; // ✅ new field
}

const ProviderSchema = new Schema<ProviderEntry>(
  {
    providerName: { type: String, required: true },
    price: { type: Number, required: true },
    barcode: { type: String, required: true },
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
  },
  { _id: false }
);

const PartSchema = new Schema<IPart>({
  name: { type: String, required: true },
  modelYears: { type: [Number], default: [] },
  carCompanies: { type: [String], default: [] },
  subMake: { type: String, default: "" },
  sellPrice: { type: Number, required: true },
  category: { type: String, required: true },
  media: { type: [String], default: [] },
  providers: { type: [ProviderSchema], default: [] },
  companyBarcode: { type: String, default: "" }, // ✅ new field
});

export const Part =
  mongoose.models.Part || mongoose.model<IPart>("Part", PartSchema);
