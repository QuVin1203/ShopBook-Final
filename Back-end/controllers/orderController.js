import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

import Order from "../models/order.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";
import UserVoucher from "../models/userVoucher.js";

export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,

    paymentMethod,
    paymentInfo,
    paymentStatus,

    discountAmount,
    shippingDiscount,
    voucherCode,
    userVoucher,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,

    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,

    paymentMethod,

    paymentInfo: paymentInfo || "Unpaid",

    paymentStatus:
      paymentStatus ||
      (paymentMethod === "BANK_TRANSFER"
        ? "PENDING"
        : "UNPAID"),

    discountAmount: discountAmount || 0,
    shippingDiscount: shippingDiscount || 0,

    voucherCode: voucherCode || null,
    userVoucher: userVoucher || null,

    user: req.user._id,
  });

  if (userVoucher) {
    const claimedVoucher = await UserVoucher.findOne({
      _id: userVoucher,
      user: req.user._id,
      isUsed: false,
    });

    if (claimedVoucher) {
      claimedVoucher.isUsed = true;
      claimedVoucher.usedAt = Date.now();

      await claimedVoucher.save();
    }
  }

  res.status(201).json({
    success: true,
    order,
  });
});

export const myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    orders,
  });
});

export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  res.status(200).json({
    order,
  });
});

export const allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find().populate("user", "name email");

  res.status(200).json({
    orders,
  });
});

export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  if (order?.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered", 400));
  }

  if (req.body.status === "Delivered") {
    for (const item of order.orderItems) {
      const product = await Product.findById(item?.product?.toString());

      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      product.stock = product.stock - item.quantity;
      product.sold = (product.sold || 0) + item.quantity;

      await product.save({ validateBeforeSave: false });
    }

    order.deliveredAt = Date.now();

    // COD: delivered means customer has paid when receiving the order
    if (order.paymentMethod === "COD") {
      order.paymentStatus = "PAID";
      order.paymentInfo = "Paid";
    }
  }

  order.orderStatus = req.body.status;

  await order.save();

  res.status(200).json({
    success: true,
  });
});

export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
  });
});

async function getSalesData(startDate, endDate) {
  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
        },

        totalSales: { $sum: "$itemsPrice" },

        totalShippingRevenue: {
          $sum: {
            $subtract: [
              "$shippingAmount",
              { $ifNull: ["$shippingDiscount", 0] },
            ],
          },
        },

        totalVoucherDiscount: {
          $sum: { $ifNull: ["$discountAmount", 0] },
        },

        totalShippingDiscount: {
          $sum: { $ifNull: ["$shippingDiscount", 0] },
        },

        totalPayments: { $sum: "$totalAmount" },

        numOrders: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.date": 1,
      },
    },
  ]);

  return salesData;
}

export const getDashboardSales = catchAsyncErrors(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const sales = await getSalesData(startDate, endDate);

  const totalSales = sales.reduce(
    (acc, item) => acc + Number(item.totalSales || 0),
    0
  );

  const totalShippingRevenue = sales.reduce(
    (acc, item) => acc + Number(item.totalShippingRevenue || 0),
    0
  );

  const totalVoucherDiscount = sales.reduce(
    (acc, item) => acc + Number(item.totalVoucherDiscount || 0),
    0
  );

  const totalShippingDiscount = sales.reduce(
    (acc, item) => acc + Number(item.totalShippingDiscount || 0),
    0
  );

  const totalPayments = sales.reduce(
    (acc, item) => acc + Number(item.totalPayments || 0),
    0
  );

  const totalNumOrders = sales.reduce(
    (acc, item) => acc + Number(item.numOrders || 0),
    0
  );

  const netRevenue =
    totalSales + totalShippingRevenue - totalVoucherDiscount;

  const topSellingBooks = await Product.find({
    sold: { $gt: 0 },
  })
    .sort({ sold: -1 })
    .limit(5)
    .select("name sold");

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "name")
    .select(
      "totalAmount itemsPrice shippingAmount shippingDiscount discountAmount orderStatus user createdAt"
    );

  res.status(200).json({
    totalSales,
    totalShippingRevenue,
    totalVoucherDiscount,
    totalShippingDiscount,
    netRevenue,
    totalPayments,
    totalNumOrders,
    sales,
    topSellingBooks,
    recentOrders,
  });
});

export const confirmPayment = catchAsyncErrors(
  async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.paymentStatus = "PAID";

    await order.save();

    res.status(200).json({
      success: true,
    });
  }
);