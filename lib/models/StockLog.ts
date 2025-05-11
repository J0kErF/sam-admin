import mongoose, { Schema, models } from "mongoose";

const StockLogSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
  lastCountedAt: { type: Date, default: Date.now },
});

const StockLog = models.StockLog || mongoose.model("StockLog", StockLogSchema);
export default StockLog;
