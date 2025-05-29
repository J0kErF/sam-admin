import mongoose, { Schema, Document } from "mongoose";

export interface IProvider extends Document {
  companyName: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  contactName?: string;
  notes?: string;
}

const ProviderSchema: Schema = new Schema({
  companyName: { type: String, required: true },
  address: { type: String, default: "" },         // ✅ no 'required'
  phoneNumber: { type: String, default: "" },
  email: { type: String, default: "" },
  contactName: { type: String, default: "" },
  notes: { type: String, default: "" },
});

export const Provider =
  mongoose.models.Provider || mongoose.model<IProvider>("Provider", ProviderSchema);
