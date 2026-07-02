import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    voucherType: {
      type: String,
      enum: ["DISCOUNT", "FREESHIP","FIXED"],
      default: "DISCOUNT",
    },

    discountPercent: {
      type: Number,
      default: 0,
    },

    minOrderAmount: {
      type: Number,
      default: 0,
    },

    maxDiscountAmount: {
      type: Number,
      default: 0,
    },

    quantity: {
      type: Number,
      default: 0,
    },
    fixedDiscountAmount: {
    type: Number,
    default: 0,
},

    claimedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Voucher", voucherSchema);