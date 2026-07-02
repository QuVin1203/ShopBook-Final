import Voucher from "../models/voucher.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import UserVoucher from "../models/userVoucher.js";


// USER
export const getActiveVouchers = catchAsyncErrors(
async (req,res)=>{

    const vouchers = await Voucher.find({
        isActive:true
    }).sort({createdAt:-1})

    res.status(200).json({
        success:true,
        vouchers
    })
}
)


// ADMIN
export const getAdminVouchers = catchAsyncErrors(
async (req,res)=>{

    const vouchers = await Voucher.find()
    .sort({createdAt:-1})

    res.status(200).json({
        success:true,
        vouchers
    })
}
)


// ADMIN
export const createVoucher = catchAsyncErrors(
async (req,res)=>{

    const voucher = await Voucher.create(req.body)

    res.status(201).json({
        success:true,
        voucher
    })
}
)


// ADMIN
export const deleteVoucher = catchAsyncErrors(
async (req,res,next)=>{

    const voucher = await Voucher.findById(req.params.id)

    if(!voucher){
        return next(
            new ErrorHandler("Voucher not found",404)
        )
    }

    await voucher.deleteOne()

    res.status(200).json({
        success:true,
        message:"Voucher deleted"
    })
}
)
export const claimVoucher = catchAsyncErrors(async (req, res, next) => {
  const voucher = await Voucher.findById(req.params.id);

  if (!voucher) {
    return next(new ErrorHandler("Voucher not found", 404));
  }

  if (!voucher.isActive) {
    return next(new ErrorHandler("Voucher is not active", 400));
  }

  if (voucher.quantity <= 0) {
    return next(new ErrorHandler("Voucher is out of stock", 400));
  }

  const alreadyClaimed = voucher.claimedUsers.some(
    (userId) => userId.toString() === req.user._id.toString()
  );

  if (alreadyClaimed) {
    return next(new ErrorHandler("You already claimed this voucher", 400));
  }

  voucher.claimedUsers.push(req.user._id);
  voucher.quantity -= 1;

  await voucher.save();

  await UserVoucher.create({
  user: req.user._id,
  voucher: voucher._id,
});

  res.status(200).json({
    success: true,
    voucher,
  });
});
export const getMyVouchers = catchAsyncErrors(
  async (req, res) => {
    const vouchers = await UserVoucher.find({
      user: req.user._id,
      isUsed: false,
    }).populate("voucher");

    res.status(200).json({
      success: true,
      vouchers,
    });
  }
);