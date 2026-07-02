import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import AdminLayout from "../layout/AdminLayout";
import Loader from "../layout/Loader";
import {
  useOrderDetailsQuery,
  useUpdateOrderMutation,
} from "../../redux/api/orderApi";

const ProcessOrder = () => {
  const params = useParams();

  const { data, isLoading } = useOrderDetailsQuery(params?.id);
  const order = data?.order || {};

  const [status, setStatus] = useState("");

  const [updateOrder, { error, isLoading: isUpdateLoading, isSuccess }] =
    useUpdateOrderMutation();

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
    if (orderStatus) setStatus(orderStatus);
  }, [orderStatus]);

  useEffect(() => {
    if (error) toast.error(error?.data?.message || "Update failed");
    if (isSuccess) toast.success("Order updated");
  }, [error, isSuccess]);

  const formatPrice = (price) => {
    return `${Number(price || 0).toLocaleString("vi-VN")} ₫`;
  };

  const formatAddress = () => {
    return [shippingInfo?.address, shippingInfo?.city, shippingInfo?.country]
      .filter(Boolean)
      .join(", ");
  };

  const getPaymentStatusText = () => {
    if (paymentStatus === "PAID") return "Paid";
    if (paymentStatus === "PENDING") return "Pending";
    return "Unpaid";
  };

  const getPaymentStatusClass = () => {
    if (paymentStatus === "PAID") return "admin-status paid";
    if (paymentStatus === "PENDING") return "admin-status pending";
    return "admin-status unpaid";
  };

  const getOrderStatusClass = (value) => {
    if (value === "Delivered") return "admin-status paid";
    if (value === "Shipped") return "admin-status shipped";
    return "admin-status pending";
  };

  const updateOrderHandler = () => {
    if (!status) {
      toast.error("Please select order status");
      return;
    }

    updateOrder({
      id: order?._id,
      body: { status },
    });
  };

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
      <div className="process-order-page">
        <div className="process-order-header">
          <div>
            <span className="admin-page-badge">Order Management</span>
            <h1>Process Order</h1>
            <p>View order information and update delivery status.</p>
          </div>

          <Link
            to={`/invoice/order/${order?._id}`}
            className="process-invoice-btn"
          >
            <i className="fa fa-print"></i> Generate Invoice
          </Link>
        </div>

        <div className="process-order-grid">
          <div className="process-order-main">
            <div className="admin-info-card">
              <h3>Order Details</h3>

              <div className="admin-detail-row">
                <span>Order ID</span>
                <strong>{order?._id}</strong>
              </div>

              <div className="admin-detail-row">
                <span>Order Status</span>
                <strong className={getOrderStatusClass(orderStatus)}>
                  {orderStatus || "Processing"}
                </strong>
              </div>

              <div className="admin-detail-row">
                <span>Voucher</span>
                <strong>{voucherCode || "No voucher"}</strong>
              </div>
            </div>

            <div className="admin-info-card">
              <h3>Shipping Information</h3>

              <div className="admin-detail-row">
                <span>Name</span>
                <strong>{user?.name || "N/A"}</strong>
              </div>

              <div className="admin-detail-row">
                <span>Phone</span>
                <strong>{shippingInfo?.phoneNo || "N/A"}</strong>
              </div>

              <div className="admin-detail-row">
                <span>Address</span>
                <strong>{formatAddress() || "N/A"}</strong>
              </div>
            </div>

            <div className="admin-info-card">
              <h3>Order Items</h3>

              {orderItems?.map((item) => (
                <div key={item?.product} className="admin-order-item">
                  <img src={item?.image} alt={item?.name} />

                  <div className="admin-order-item-info">
                    <Link to={`/product/${item?.product}`}>{item?.name}</Link>
                    <p>Quantity: {item?.quantity}</p>
                  </div>

                  <div className="admin-order-item-price">
                    <strong>{formatPrice(item?.price * item?.quantity)}</strong>
                    <span>
                      {item?.quantity} × {formatPrice(item?.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="process-order-side">
            <div className="admin-info-card">
              <h3>Update Status</h3>

              <select
                className="form-select process-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>

              <button
                className="process-update-btn"
                onClick={updateOrderHandler}
                disabled={isUpdateLoading}
              >
                {isUpdateLoading ? "Updating..." : "Update Status"}
              </button>
            </div>

            <div className="admin-info-card">
              <h3>Payment Information</h3>

              <div className="admin-detail-row">
                <span>Status</span>
                <strong className={getPaymentStatusClass()}>
                  {getPaymentStatusText()}
                </strong>
              </div>

              <div className="admin-detail-row">
                <span>Method</span>
                <strong>
                  {paymentMethod === "BANK_TRANSFER"
                    ? "Bank Transfer"
                    : "Cash on Delivery"}
                </strong>
              </div>

              <div className="admin-detail-row">
                <span>Books Price</span>
                <strong>{formatPrice(itemsPrice)}</strong>
              </div>

              <div className="admin-detail-row">
                <span>Shipping Fee</span>
                <strong>{formatPrice(shippingAmount)}</strong>
              </div>

              {Number(discountAmount || 0) > 0 && (
                <div className="admin-detail-row discount">
                  <span>Voucher Discount</span>
                  <strong>-{formatPrice(discountAmount)}</strong>
                </div>
              )}

              {Number(shippingDiscount || 0) > 0 && (
                <div className="admin-detail-row discount">
                  <span>Free Ship Discount</span>
                  <strong>-{formatPrice(shippingDiscount)}</strong>
                </div>
              )}

              <div className="admin-total-row">
                <span>Total</span>
                <strong>{formatPrice(totalAmount)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProcessOrder;