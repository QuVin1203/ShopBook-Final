import React from "react";
import toast from "react-hot-toast";
import {
  useGetActiveVouchersQuery,
  useClaimVoucherMutation,
} from "../../redux/api/voucherApi";
import Loader from "../layout/Loader";

const Voucher = () => {
  const { data, isLoading, refetch } = useGetActiveVouchersQuery();
  const [claimVoucher, { isLoading: isClaiming }] = useClaimVoucherMutation();

  const saveVoucher = async (voucher) => {
    try {
      const res = await claimVoucher(voucher._id).unwrap();

      const saved = JSON.parse(localStorage.getItem("vouchers")) || [];
      const existed = saved.find((item) => item.code === voucher.code);

      if (!existed) {
        localStorage.setItem(
          "vouchers",
          JSON.stringify([...saved, res?.voucher || voucher])
        );
      }

      toast.success(res?.message || "Voucher saved");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Claim voucher failed");
    }
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN");
  };

  if (isLoading) return <Loader />;

  return (
    <div className="voucher-page">
      <h2>🎁 Available Vouchers</h2>

      <div className="voucher-list">
        {data?.vouchers?.length > 0 ? (
          data.vouchers.map((voucher) => (
            <div
              className={`voucher-card ${
                voucher.voucherType === "FREESHIP"
                  ? "freeship-voucher-card"
                  : ""
              }`}
              key={voucher._id}
            >
              <div>
                <h3>
                  {voucher.voucherType === "FREESHIP" ? "🚚 " : "🎁 "}
                  {voucher.code}
                </h3>

                {voucher.voucherType === "FREESHIP" ? (
                  <p>Free shipping for your order</p>
                ) : (
                  <p>Discount {voucher.discountPercent}% for your order</p>
                )}

                <p>Min order: {formatPrice(voucher.minOrderAmount)} ₫</p>

                {voucher.voucherType === "DISCOUNT" && (
                  <p>
                    Max discount: {formatPrice(voucher.maxDiscountAmount)} ₫
                  </p>
                )}

                <p className="voucher-quantity">
                  Remaining: <strong>{voucher.quantity || 0}</strong>
                </p>

                <strong>
                  Status: {voucher.isActive ? "Active" : "Inactive"}
                </strong>
              </div>

              <button
                onClick={() => saveVoucher(voucher)}
                disabled={isClaiming || Number(voucher.quantity || 0) <= 0}
              >
                {Number(voucher.quantity || 0) <= 0
                  ? "Out of stock"
                  : isClaiming
                  ? "Saving..."
                  : "Save Voucher"}
              </button>
            </div>
          ))
        ) : (
          <p>No vouchers available.</p>
        )}
      </div>
    </div>
  );
};

export default Voucher;