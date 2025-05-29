import mongoose, { Schema, model, models } from "mongoose";

const LogSchema = new Schema({
  partId: { type: String, required: true },
  reason: { type: String, required: true },
  quantity: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default models.Log || model("Log", LogSchema);
