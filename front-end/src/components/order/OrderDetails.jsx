import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useOrderDetailsQuery } from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";

const OrderDetails = () => {
  const params = useParams();

  const { data, isLoading, error } = useOrderDetailsQuery(params?.id);

  const order = data?.order || {};

  const {
    shippingInfo,
    orderItems,
    user,
    totalAmount,
    orderStatus,
    paymentMethod,
    paymentStatus,
    itemsPrice,
    shippingAmount,
    discountAmount,
    shippingDiscount,
    voucherCode,
  } = order;

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN");
  };

  const getPaymentStatusClass = () => {
    if (paymentStatus === "PAID") return "status-success";
    if (paymentStatus === "PENDING") return "status-warning";
    return "status-danger";
  };

  const getPaymentStatusText = () => {
    if (paymentStatus === "PAID") return "PAID";
    if (paymentStatus === "PENDING") return "PENDING VERIFICATION";
    return "UNPAID";
  };

  if (isLoading) return <Loader />;

  return (
    <div className="order-detail-page">
      <div className="order-detail-header">
        <div>
          <span className="order-detail-badge">Order Details</span>
          <h1>Your Order</h1>
          <p>Order ID: {order?._id}</p>
        </div>

        <Link className="order-invoice-btn" to={`/invoice/order/${order?._id}`}>
          <i className="fa fa-print"></i> Invoice
        </Link>
      </div>

      <div className="order-detail-grid">
        <div className="order-detail-main">
          <div className="order-info-card">
            <h3>Order Summary</h3>

            <div className="detail-row">
              <span>Status</span>
              <strong
                className={
                  String(orderStatus).includes("Delivered")
                    ? "status-success"
                    : "status-warning"
                }
              >
                {orderStatus}
              </strong>
            </div>

            <div className="detail-row">
              <span>Date</span>
              <strong>
                {order?.createdAt
                  ? new Date(order?.createdAt).toLocaleString("en-US")
                  : "N/A"}
              </strong>
            </div>
          </div>

          <div className="order-info-card">
            <h3>Shipping Information</h3>

            <div className="detail-row">
              <span>Name</span>
              <strong>{user?.name}</strong>
            </div>

            <div className="detail-row">
              <span>Phone No</span>
              <strong>{shippingInfo?.phoneNo}</strong>
            </div>

            <div className="detail-row">
              <span>Address</span>
              <strong>
                {shippingInfo?.address}, {shippingInfo?.city},{" "}
                {shippingInfo?.zipCode}, {shippingInfo?.country}
              </strong>
            </div>
          </div>

          <div className="order-info-card">
            <h3>Order Items</h3>

            {orderItems?.map((item) => (
              <div key={item?.product} className="order-item-card">
                <img src={item?.image} alt={item?.name} />

                <div>
                  <Link to={`/product/${item?.product}`}>{item?.name}</Link>
                  <p>{item?.quantity} units</p>
                </div>

                <strong>{formatPrice(item?.price)} đ</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="order-payment-card">
          <h3>Payment Information</h3>

          <div className="payment-status-box">
            <span>Payment Status</span>
            <strong className={getPaymentStatusClass()}>
              {getPaymentStatusText()}
            </strong>
          </div>

          <div className="detail-row">
            <span>Method</span>
            <strong>
              {paymentMethod === "BANK_TRANSFER"
                ? "Bank Transfer"
                : "Cash on Delivery"}
            </strong>
          </div>

          {paymentMethod === "BANK_TRANSFER" && (
            <div className="detail-row">
              <span>Verification</span>
              <strong>
                {paymentStatus === "PAID"
                  ? "Payment confirmed"
                  : "Waiting for admin confirmation"}
              </strong>
            </div>
          )}

          {voucherCode && (
            <div className="detail-row">
              <span>Voucher</span>
              <strong>{voucherCode}</strong>
            </div>
          )}

          <div className="detail-row">
            <span>Books Price</span>
            <strong>{formatPrice(itemsPrice)} đ</strong>
          </div>

          <div className="detail-row">
            <span>Shipping Fee</span>
            <strong>{formatPrice(shippingAmount)} đ</strong>
          </div>

          {Number(discountAmount || 0) > 0 && (
            <div className="detail-row">
              <span>Voucher Discount</span>
              <strong>-{formatPrice(discountAmount)} đ</strong>
            </div>
          )}

          {Number(shippingDiscount || 0) > 0 && (
            <div className="detail-row">
              <span>Free Ship Discount</span>
              <strong>-{formatPrice(shippingDiscount)} đ</strong>
            </div>
          )}

          <div className="detail-total">
            <span>Total Amount</span>
            <strong>{formatPrice(totalAmount)} đ</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;