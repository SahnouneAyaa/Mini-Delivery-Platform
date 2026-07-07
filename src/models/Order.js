import mongoose from "mongoose";
import crypto from "crypto";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    merchant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    customerName: { type: String, required: true, trim: true },
    deliveryAddress: { type: String, required: true, trim: true },
    products: {
      type: [ProductSchema],
      required: true,
      validate: (arr) => Array.isArray(arr) && arr.length > 0,
    },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending_assignment", "assigned", "in_delivery", "delivered"],
      default: "pending_assignment",
    },
    trackingId: {
      type: String,
      unique: true,
      default: () => crypto.randomUUID(),
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);