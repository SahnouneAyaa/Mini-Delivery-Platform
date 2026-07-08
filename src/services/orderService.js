import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { AppError } from "@/app/api/apiHelpers";

const ACTIVE_STATUSES = ["assigned", "in_delivery"];

const STATUS_FLOW = {
  pending_assignment: "assigned",
  assigned: "in_delivery",
  in_delivery: "delivered",
};

async function isDriverAvailable(driverId) {
  const activeCount = await Order.countDocuments({
    driver: driverId,
    status: { $in: ACTIVE_STATUSES },
  });
  return activeCount === 0;
}

export async function createOrder(
  merchantId,
  { customerName, deliveryAddress, products, total },
) {
  if (!customerName || !deliveryAddress || !products || total === undefined) {
    throw new AppError("Tous les champs sont requis", 400);
  }
  if (!Array.isArray(products) || products.length === 0) {
    throw new AppError("La commande doit contenir au moins un produit", 400);
  }
  for (const p of products) {
    if (!p.name || !p.quantity || p.quantity < 1) {
      throw new AppError(
        "Chaque produit doit avoir un nom et une quantité valide",
        400,
      );
    }
  }
  if (total < 0) {
    throw new AppError("Le total ne peut pas être négatif", 400);
  }

  await connectDB();

  const order = await Order.create({
    merchant: merchantId,
    customerName,
    deliveryAddress,
    products,
    total,
  });
  return order;
}

export async function getMerchantOrders(merchantId) {
  await connectDB();
  return Order.find({ merchant: merchantId })
    .populate("driver", "username email")
    .sort({ createdAt: -1 });
}

export async function getDriverOrders(driverId) {
  await connectDB();
  const orders = await Order.find({ driver: driverId })
    .populate("merchant", "username email")
    .sort({ createdAt: -1 });

  console.log("DEBUG driver orders:", JSON.stringify(orders, null, 2));

  return orders;
}

export async function getAvailableDrivers() {
  await connectDB();

  const drivers = await User.aggregate([
    { $match: { role: "driver" } },
    {
      $lookup: {
        from: "orders",
        let: { driverId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$driver", "$$driverId"] },
                  { $in: ["$status", ACTIVE_STATUSES] },
                ],
              },
            },
          },
        ],
        as: "activeOrders",
      },
    },
    { $match: { activeOrders: { $size: 0 } } },
    { $project: { password: 0, activeOrders: 0 } },
  ]);

  return drivers;
}

export async function assignDriverToOrder(merchantId, orderId, driverId) {
  await connectDB();

  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Commande introuvable", 404);
  if (order.merchant.toString() !== merchantId)
    throw new AppError("Accès refusé à cette commande", 403);
  if (order.status !== "pending_assignment")
    throw new AppError("Cette commande a déjà un livreur assigné", 400);

  const driver = await User.findOne({ _id: driverId, role: "driver" });
  if (!driver) throw new AppError("Livreur introuvable", 404);

  const available = await isDriverAvailable(driverId);
  if (!available)
    throw new AppError("Ce livreur n'est pas disponible actuellement", 400);

  order.driver = driverId;
  order.status = "assigned";
  await order.save();

  return order;
}

export async function updateOrderStatus(driverId, orderId, newStatus) {
  await connectDB();

  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Commande introuvable", 404);
  if (!order.driver || order.driver.toString() !== driverId)
    throw new AppError("Accès refusé à cette commande", 403);

  const expectedNext = STATUS_FLOW[order.status];
  if (!expectedNext || expectedNext !== newStatus) {
    throw new AppError(
      `Transition invalide : de "${order.status}" vers "${newStatus}"`,
      400,
    );
  }

  order.status = newStatus;
  await order.save();

  return order;
}

export async function getOrderByTrackingId(trackingId) {
  await connectDB();

  const order = await Order.findOne({ trackingId }).select(
    "customerName deliveryAddress status trackingId createdAt",
  );

  if (!order) throw new AppError("Commande introuvable", 404);
  return order;
}

export async function getMerchantStats(merchantId) {
  await connectDB();

  const results = await Order.aggregate([
    { $match: { merchant: new mongoose.Types.ObjectId(merchantId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const counts = {
    pending_assignment: 0,
    assigned: 0,
    in_delivery: 0,
    delivered: 0,
  };
  results.forEach((r) => {
    counts[r._id] = r.count;
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return {
    total,
    pending_assignment: counts.pending_assignment,
    in_delivery: counts.in_delivery,
    delivered: counts.delivered,
  };
}

export async function getDriverStats(driverId) {
  await connectDB();

  const results = await Order.aggregate([
    { $match: { driver: new mongoose.Types.ObjectId(driverId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const counts = { assigned: 0, in_delivery: 0, delivered: 0 };
  results.forEach((r) => {
    if (counts[r._id] !== undefined) counts[r._id] = r.count;
  });

  const total = counts.assigned + counts.in_delivery + counts.delivered;

  return {
    total,
    assigned: counts.assigned,
    in_delivery: counts.in_delivery,
    delivered: counts.delivered,
  };
}
