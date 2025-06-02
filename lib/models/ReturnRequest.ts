import mongoose, { Schema, Document } from "mongoose";

interface ReturnedPart {
    partId: string;
    providerBarcode: string;
    quantity: number;
    price: number; // total price per line
    reason?: string;
}

export interface IReturnRequest extends Document {
    providerName: string;
    contactName?: string;
    status: string;
    date: Date;
    parts: ReturnedPart[];
    photos: string[]; // Cloudinary image URLs
}

const ReturnedPartSchema = new Schema<ReturnedPart>({
    partId: { type: String, required: true },
    providerBarcode: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    reason: { type: String },
});

const ReturnRequestSchema = new Schema<IReturnRequest>(
    {
        providerName: { type: String, required: true },
        contactName: { type: String },
        status: {
            type: String,
        },
        date: { type: Date, default: Date.now },
        parts: { type: [ReturnedPartSchema], required: true },
        photos: { type: [String], required: false },
    },
    { timestamps: true }
);

export const ReturnRequest =
    mongoose.models.ReturnRequest ||
    mongoose.model<IReturnRequest>("ReturnRequest", ReturnRequestSchema);
