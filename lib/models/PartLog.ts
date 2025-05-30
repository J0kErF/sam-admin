// models/PartLog.ts
import mongoose, { Schema, Document } from "mongoose";

interface UpdateEntry {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface IPartLog extends Document {
  partId: mongoose.Types.ObjectId;
  reason: string;
  updates: UpdateEntry[];
  createdAt: Date;
}

const UpdateSchema = new Schema<UpdateEntry>({
  field: { type: String, required: true },
  oldValue: Schema.Types.Mixed,
  newValue: Schema.Types.Mixed,
});

const PartLogSchema = new Schema<IPartLog>({
  partId: { type: Schema.Types.ObjectId, ref: "Part", required: true },
  reason: { type: String, required: true },
  updates: [UpdateSchema],
  createdAt: { type: Date, default: Date.now },
});

export const PartLog = mongoose.models.PartLog || mongoose.model<IPartLog>("PartLog", PartLogSchema);
