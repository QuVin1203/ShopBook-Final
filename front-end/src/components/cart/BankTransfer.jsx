import React from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useCreateNewOrderMutation } from "../../redux/api/orderApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BankTransfer = () => {
  const navigate = useNavigate();

  const orderData = JSON.parse(sessionStorage.getItem("orderData"));

  const [createNewOrder, { isLoading }] = useCreateNewOrderMutation();

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN");
  };

  const bankId = "TCB";
  const accountNo = "19037836649011";
  const accountName = "NGUYEN QUANG VINH";

  const transferContent = `SHOPBOOK_${Date.now()}`;

  const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${Number(
    orderData?.totalAmount || 0
  )}&addInfo=${transferContent}&accountName=${accountName}`;

  const confirmPaidHandler = async () => {
    if (!orderData) {
      toast.error("Order data not found");
      navigate("/payment_method");
      return;
    }

    try {
      await createNewOrder({
        ...orderData,
        paymentMethod: "BANK_TRANSFER",
        paymentStatus: "PENDING"
      }).unwrap();

      sessionStorage.removeItem("selectedUserVoucher");
      sessionStorage.removeItem("orderPrices");
      sessionStorage.removeItem("orderData");

      toast.success("Order created. Waiting for payment verification.");
      navigate("/me/orders?order_success=true");
    } catch (error) {
      toast.error(error?.data?.message || "Create order failed");
    }
  };

  if (!orderData) {
    return (
      <div className="container py-5 text-center">
        <h3>No payment data found.</h3>
        <button
          className="btn btn-warning mt-3"
          onClick={() => navigate("/payment_method")}
        >
          Back to Payment Method
        </button>
      </div>
    );
  }

  return (
    <>
      <CheckoutSteps shiping ConfirmOrder payment />

      <div className="bank-transfer-page">
        <div className="bank-transfer-card">
          <h2>Bank Transfer Payment</h2>

          <p className="bank-note">
            Please scan the QR code below and transfer the exact amount.
          </p>

          <div className="bank-qr-box">
            <img src={qrUrl} alt="Bank Transfer QR" />
          </div>

          <div className="bank-info">
            <div>
              <span>Bank</span>
              <strong>MB Bank</strong>
            </div>

            <div>
              <span>Account Number</span>
              <strong>{accountNo}</strong>
            </div>

            <div>
              <span>Account Name</span>
              <strong>{accountName}</strong>
            </div>

            <div>
              <span>Amount</span>
              <strong>{formatPrice(orderData?.totalAmount)} ₫</strong>
            </div>

            <div>
              <span>Transfer Content</span>
              <strong>{transferContent}</strong>
            </div>
          </div>

          <button
            className="bank-paid-btn"
            onClick={confirmPaidHandler}
            disabled={isLoading}
          >
            {isLoading ? "Creating Order..." : "I have paid"}
          </button>
        </div>
      </div>
    </>
  );
};

export default BankTransfer;