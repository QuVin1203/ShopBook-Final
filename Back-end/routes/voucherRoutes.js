import express from "express";

import {
  createVoucher,
  getAdminVouchers,
  getActiveVouchers,
  deleteVoucher,
    claimVoucher,
      getMyVouchers,
} from "../controllers/voucherController.js";

import {
  isAutheticatedUser,
  authorizeRoles,
} from "../middlewares/auth.js";

const router = express.Router();

router.route("/vouchers").get(getActiveVouchers);

router
  .route("/admin/vouchers")
  .get(
    isAutheticatedUser,
    authorizeRoles("admin"),
    getAdminVouchers
  )
  .post(
    isAutheticatedUser,
    authorizeRoles("admin"),
    createVoucher
  );

router
  .route("/admin/voucher/:id")
  .delete(
    isAutheticatedUser,
    authorizeRoles("admin"),
    deleteVoucher
  );

router
  .route("/voucher/claim/:id")
  .post(isAutheticatedUser, claimVoucher);

  router
  .route("/my-vouchers")
  .get(
    isAutheticatedUser,
    getMyVouchers
  );

export default router;