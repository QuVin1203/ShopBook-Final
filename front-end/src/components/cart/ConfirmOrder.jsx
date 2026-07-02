import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { caluclateOrderCost } from "../../helpers/helpers.js";
import CheckoutSteps from "./CheckoutSteps.jsx";
import { useGetMyVouchersQuery } from "../../redux/api/voucherApi.js";

const ConfirmOrder = () => {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [selectedUserVoucher, setSelectedUserVoucher] = useState(null);

  const { data } = useGetMyVouchersQuery();

  const { itemsPrice, shippingPrice, totalPrice } = caluclateOrderCost(
    cartItems,
    shippingInfo
  );

  const selectedVoucher = selectedUserVoucher?.voucher;

  const isVoucherValid =
    selectedVoucher &&
    itemsPrice >= Number(selectedVoucher?.minOrderAmount || 0);

 let discountAmount = 0;

if (selectedVoucher && isVoucherValid) {

  if (selectedVoucher.voucherType === "DISCOUNT") {
    discountAmount = Math.min(
      (itemsPrice *
        Number(selectedVoucher.discountPercent || 0)) /
        100,
      Number(selectedVoucher.maxDiscountAmount || Infinity)
    );
  }

  if (selectedVoucher.voucherType === "FIXED") {
    discountAmount = Math.min(
      Number(selectedVoucher.fixedDiscountAmount || 0),
      itemsPrice
    );
  }
}
      

  const shippingDiscount =
    selectedVoucher &&
    isVoucherValid &&
    selectedVoucher?.voucherType === "FREESHIP"
      ? shippingPrice
      : 0;

  const finalTotalPrice = totalPrice - discountAmount - shippingDiscount;

  const formatPrice = (price) => {
    return `${Number(price || 0).toLocaleString("vi-VN")} ₫`;
  };

  const selectVoucherHandler = (userVoucher) => {
    const voucher = userVoucher?.voucher;
    const valid = itemsPrice >= Number(voucher?.minOrderAmount || 0);

    let currentDiscount = 0;

if (voucher && valid) {

  if (voucher.voucherType === "DISCOUNT") {
    currentDiscount = Math.min(
      (itemsPrice *
        Number(voucher.discountPercent || 0)) /
        100,
      Number(voucher.maxDiscountAmount || Infinity)
    );
  }

  if (voucher.voucherType === "FIXED") {
    currentDiscount = Math.min(
      Number(voucher.fixedDiscountAmount || 0),
      itemsPrice
    );
  }
}

    const currentShippingDiscount =
      voucher && valid && voucher?.voucherType === "FREESHIP"
        ? shippingPrice
        : 0;

    const currentFinalTotal =
      totalPrice - currentDiscount - currentShippingDiscount;

    setSelectedUserVoucher(userVoucher);

    sessionStorage.setItem("selectedUserVoucher", JSON.stringify(userVoucher));

    sessionStorage.setItem(
      "orderPrices",
      JSON.stringify({
        itemsPrice,
        shippingPrice,
        taxPrice: 0,
        discountAmount: currentDiscount,
        shippingDiscount: currentShippingDiscount,
        totalPrice: currentFinalTotal,
      })
    );
  };

  const removeVoucherHandler = () => {
    setSelectedUserVoucher(null);
    sessionStorage.removeItem("selectedUserVoucher");
    sessionStorage.removeItem("orderPrices");
  };

  return (
    <>
      <CheckoutSteps shiping ConfirmOrder />

      <div className="confirm-page">
        <div className="confirm-content">
          <div className="confirm-left">
            <div className="confirm-card">
              <h3>Shipping Information</h3>

              <div className="info-row">
                <span>Name</span>
                <strong>{user?.name}</strong>
              </div>

              <div className="info-row">
                <span>Phone</span>
                <strong>{shippingInfo?.phoneNo}</strong>
              </div>

              <div className="info-row">
                <span>Address</span>
                <strong>
                  {shippingInfo?.address}, {shippingInfo?.city}, {shippingInfo?.country}
                </strong>
              </div>
            </div>

            <div className="confirm-card">
              <h3>Your Cart Items</h3>

              {cartItems?.map((item) => (
                <div key={item?.product} className="confirm-cart-item">
                  <img src={item?.image} alt={item?.name} />

                  <Link to={`/product/${item.product}`}>{item?.name}</Link>

                  <p>
                    {item?.quantity} × {formatPrice(item?.price)} ={" "}
                    <strong>{formatPrice(item?.quantity * item?.price)}</strong>
                  </p>
                </div>
              ))}
            </div>

            <div className="confirm-card">
              <h3>Apply Voucher</h3>

              {data?.vouchers?.length === 0 ? (
                <p>No available vouchers.</p>
              ) : (
                data?.vouchers?.map((userVoucher) => {
                  const voucher = userVoucher?.voucher;
                  const valid =
                    itemsPrice >= Number(voucher?.minOrderAmount || 0);

                  return (
                    <button
                      key={userVoucher?._id}
                      type="button"
                      className={`voucher-apply-btn ${
                        selectedUserVoucher?._id === userVoucher?._id
                          ? "active"
                          : ""
                      }`}
                      disabled={!valid}
                      onClick={() => selectVoucherHandler(userVoucher)}
                    >
                      <div>
                        <strong>
                          {voucher?.voucherType === "FREESHIP" ? "🚚 " : "🎁 "}
                          {voucher?.code}
                        </strong>
                      </div>

                      <small>
  {voucher?.voucherType === "FREESHIP" &&
    "Free Shipping"}

  {voucher?.voucherType === "DISCOUNT" &&
    `Giảm ${voucher.discountPercent}% - Max ${formatPrice(
      voucher.maxDiscountAmount
    )}`}

  {voucher?.voucherType === "FIXED" &&
    `Giảm trực tiếp ${formatPrice(
      voucher.fixedDiscountAmount
    )}`}
</small>

                      {!valid && (
                        <p className="voucher-invalid">
                          Min order {formatPrice(voucher?.minOrderAmount)}
                        </p>
                      )}
                    </button>
                  );
                })
              )}

              {selectedVoucher && (
                <>
                  <p className="voucher-selected">
                    Applied: <b>{selectedVoucher.code}</b>
                  </p>

                  <button
                    type="button"
                    className="remove-voucher-btn"
                    onClick={removeVoucherHandler}
                  >
                    Remove Voucher
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="confirm-summary">
            <h3>Order Summary</h3>

            <div className="summary-line">
              <span>Subtotal</span>
              <strong>{formatPrice(itemsPrice)}</strong>
            </div>

            <div className="summary-line">
              <span>Shipping</span>
              <strong>
                {shippingPrice === 0 ? "Free" : formatPrice(shippingPrice)}
              </strong>
            </div>

            {discountAmount > 0 && (
              <div className="summary-line discount-summary">
                <span>Voucher Discount</span>
                <strong>-{formatPrice(discountAmount)}</strong>
              </div>
            )}

            {shippingDiscount > 0 && (
              <div className="summary-line discount-summary">
                <span>Free Shipping Voucher</span>
                <strong>-{formatPrice(shippingDiscount)}</strong>
              </div>
            )}

            <div className="summary-total">
              <span>Total</span>
              <strong className="final-total">
                {formatPrice(finalTotalPrice)}
              </strong>
            </div>

            <Link to="/payment_method" className="confirm-payment-btn">
              Proceed to Payment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;