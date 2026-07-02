import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Invoice.css";
import { useOrderDetailsQuery } from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Invoice = () => {
  const params = useParams();
  const { data, isLoading, error } = useOrderDetailsQuery(params?.id);

  const order = data?.order || {};
  const { shippingInfo, orderItems, paymentInfo, paymentStatus, user } = order;

  useEffect(() => {
    if (error) toast.error(error?.data?.message);
  }, [error]);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN");
  };

  const getPaymentText = () => {
    if (paymentStatus === "PAID") return "Paid";
    if (paymentStatus === "PENDING") return "Pending";
    return paymentInfo || "Unpaid";
  };

  const handleDownload = async () => {
    const input = document.getElementById("order_invoice");

    if (!input) {
      toast.error("Invoice not found");
      return;
    }

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        ignoreElements: (element) => {
          return element.classList?.contains("ignore-pdf");
        },
        onclone: (clonedDoc) => {
          const allElements = clonedDoc.querySelectorAll("*");

          allElements.forEach((el) => {
            const style = window.getComputedStyle(el);

            if (style.color.includes("oklch")) {
              el.style.color = "#1f2937";
            }

            if (style.backgroundColor.includes("oklch")) {
              el.style.backgroundColor = "#ffffff";
            }

            if (style.borderColor.includes("oklch")) {
              el.style.borderColor = "#e5e7eb";
            }
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${order?._id}.pdf`);
    } catch (err) {
      toast.error("Download invoice failed");
      console.log(err);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="invoice-page">
      <button className="invoice-download-btn ignore-pdf" onClick={handleDownload}>
        <i className="fa fa-print"></i> Download Invoice
      </button>

      <div id="order_invoice" className="invoice-card">
        <div className="invoice-top">
          <div>
            <h2>ShopBook</h2>
            <p>Online Book Store</p>
          </div>

          <div className="invoice-title-box">
            <h1>INVOICE</h1>
            <span>#{order?._id}</span>
          </div>
        </div>

        <div className="invoice-info-grid">
          <div>
            <h4>Billed To</h4>
            <p>
              <strong>{user?.name}</strong>
            </p>
            <p>{user?.email}</p>
            <p>{shippingInfo?.phoneNo}</p>
            <p>
              {shippingInfo?.address}, {shippingInfo?.city},{" "}
              {shippingInfo?.country}
            </p>
          </div>

          <div>
            <h4>Invoice Info</h4>
            <p>
              <span>Date:</span>{" "}
              {order?.createdAt
                ? new Date(order?.createdAt).toLocaleDateString("en-US")
                : "N/A"}
            </p>
            <p>
              <span>Payment:</span> {getPaymentText()}
            </p>
            <p>
              <span>Method:</span> {order?.paymentMethod}
            </p>
            <p>
              <span>Status:</span> {order?.orderStatus}
            </p>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {orderItems?.map((item) => (
              <tr key={item?.product}>
                <td>
                  <div className="invoice-product">
                    <img src={item?.image} alt={item?.name} />
                    <div>
                      <strong>{item?.name}</strong>
                      <p>ID: {item?.product}</p>
                    </div>
                  </div>
                </td>

                <td>{formatPrice(item?.price)} đ</td>
                <td>{item?.quantity}</td>
                <td>{formatPrice(item?.price * item?.quantity)} đ</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-total-box">
          <div>
            <span>Subtotal</span>
            <strong>{formatPrice(order?.itemsPrice)} đ</strong>
          </div>

          {Number(order?.discountAmount || 0) > 0 && (
            <div>
              <span>Voucher Discount</span>
              <strong>-{formatPrice(order?.discountAmount)} đ</strong>
            </div>
          )}

          <div>
            <span>Shipping</span>
            <strong>{formatPrice(order?.shippingAmount)} đ</strong>
          </div>

          {Number(order?.shippingDiscount || 0) > 0 && (
            <div>
              <span>Shipping Discount</span>
              <strong>-{formatPrice(order?.shippingDiscount)} đ</strong>
            </div>
          )}

          <div className="grand-total">
            <span>Grand Total</span>
            <strong>{formatPrice(order?.totalAmount)} đ</strong>
          </div>
        </div>

        <div className="invoice-note">
          <strong>Notice:</strong> Thank you for shopping at ShopBook. This
          invoice is valid without a signature.
        </div>
      </div>
    </div>
  );
};

export default Invoice;