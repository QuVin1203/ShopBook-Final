import React, { useEffect, useState } from "react";
import CheckoutSteps from "./CheckoutSteps";
import { caluclateOrderCost } from "../../helpers/helpers";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCreateNewOrderMutation } from "../../redux/api/orderApi";
import toast from "react-hot-toast";

const PaymentMethod = () => {
  const [method, setMethod] = useState("");

  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const [createNewOrder, { isLoading, error, isSuccess }] =
    useCreateNewOrderMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Order failed");
    }

    if (isSuccess) {
      sessionStorage.removeItem("selectedUserVoucher");
      sessionStorage.removeItem("orderPrices");
      sessionStorage.removeItem("orderData");
      navigate("/me/orders?order_success=true");
    }
  }, [error, isSuccess, navigate]);

  const buildOrderData = () => {
    const selectedUserVoucher = JSON.parse(
      sessionStorage.getItem("selectedUserVoucher")
    );

    const orderPrices = JSON.parse(sessionStorage.getItem("orderPrices"));

    const { itemsPrice, shippingPrice, totalPrice } = caluclateOrderCost(
      cartItems,
      shippingInfo
    );

    return {
      shippingInfo,
      orderItems: cartItems,
      itemsPrice: orderPrices?.itemsPrice || itemsPrice,
      shippingAmount: orderPrices?.shippingPrice ?? shippingPrice,
      taxAmount: 0,
      totalAmount: orderPrices?.totalPrice || totalPrice,
      discountAmount: orderPrices?.discountAmount || 0,
      shippingDiscount: orderPrices?.shippingDiscount || 0,
      userVoucher: selectedUserVoucher?._id || null,
      voucherCode: selectedUserVoucher?.voucher?.code || null,
    };
  };

  const submitHanler = (e) => {
    e.preventDefault();

    if (!method) {
      toast.error("Please select payment method");
      return;
    }

    const orderData = buildOrderData();

    if (method === "COD") {
      createNewOrder({
        ...orderData,
        paymentMethod: "COD",
        paymentStatus: "UNPAID",
      });
    }

    if (method === "BANK_TRANSFER") {
      sessionStorage.setItem(
        "orderData",
        JSON.stringify({
          ...orderData,
          paymentMethod: "BANK_TRANSFER",
          paymentStatus: "PENDING",
        })
      );

      navigate("/bank-transfer");
    }
  };

  return (
    <>
      <CheckoutSteps shiping ConfirmOrder payment />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body" onSubmit={submitHanler}>
            <h2 className="mb-4">Select Payment Method</h2>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="codradio"
                value="COD"
                onChange={() => setMethod("COD")}
              />

              <label className="form-check-label" htmlFor="codradio">
                Cash on Delivery
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="bankradio"
                value="BANK_TRANSFER"
                onChange={() => setMethod("BANK_TRANSFER")}
              />

              <label className="form-check-label" htmlFor="bankradio">
                Bank Transfer (QR)
              </label>
            </div>

            <button
              id="shipping_btn"
              type="submit"
              className="btn py-2 w-100"
              disabled={isLoading}
            >
              {isLoading ? "Creating Order..." : "CONTINUE"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;