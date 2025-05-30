import mongoose, { Schema, Document } from "mongoose";

export interface IProvider extends Document {
  companyName: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  contactName?: string;
  notes?: string;
  licenseNumber?: string;
  bankTransferDetails?: string;
}

const ProviderSchema: Schema = new Schema({
  companyName: { type: String, required: true },
  address: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  email: { type: String, default: "" },
  contactName: { type: String, default: "" },
  notes: { type: String, default: "" },
  licenseNumber: { type: String, default: "" },         // ✅ New field
  bankTransferDetails: { type: String, default: "" },   // ✅ New field
});

export const Provider =
  mongoose.models.Provider || mongoose.model<IProvider>("Provider", ProviderSchema);
