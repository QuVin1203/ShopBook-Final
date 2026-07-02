import React, { useEffect } from "react";
import { useMyOrdersQuery } from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import { MDBDataTable } from "mdbreact";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";

const MyOrders = () => {
  const { data, isLoading, error } = useMyOrdersQuery();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const orderSuccess = searchParams.get("order_success");

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (orderSuccess) {
      dispatch(clearCart());
      navigate("/me/orders");
    }
  }, [error, orderSuccess, dispatch, navigate]);

  if (isLoading) return <Loader />;

  const formatPrice = (price) => {
    return `${Number(price || 0).toLocaleString("vi-VN")} ₫`;
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getPaymentStatus = (order) => {
    if (order?.paymentStatus) {
      return order.paymentStatus;
    }

    const oldPaymentInfo = String(order?.paymentInfo || "").toLowerCase();

    if (oldPaymentInfo === "paid") return "PAID";
    if (oldPaymentInfo.includes("pending")) return "PENDING";

    return "UNPAID";
  };

  const renderPaymentStatus = (status) => {
    if (status === "PAID") {
      return <span className="status-badge paid">PAID</span>;
    }

    if (status === "PENDING") {
      return <span className="status-badge processing">PENDING</span>;
    }

    return <span className="status-badge unpaid">UNPAID</span>;
  };

  const renderOrderStatus = (status) => {
    if (status === "Delivered") {
      return <span className="status-badge paid">Delivered</span>;
    }

    if (status === "Shipped") {
      return <span className="status-badge shipping">Shipped</span>;
    }

    return <span className="status-badge processing">Processing</span>;
  };

  const setOrders = () => {
    const orders = {
      columns: [
        {
          label: "Order Date",
          field: "orderDate",
          sort: "desc",
        },
        {
          label: "Order Total",
          field: "amount",
          sort: "asc",
        },
        {
          label: "Payment Status",
          field: "status",
          sort: "asc",
        },
        {
          label: "Order Status",
          field: "orderStatus",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    const sortedOrders = [...(data?.orders || [])].sort(
      (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
    );

    sortedOrders.forEach((order) => {
      const paymentStatus = getPaymentStatus(order);
      const orderStatus = order?.orderStatus || "Processing";

      orders.rows.push({
        orderDate: (
          <div className="order-date-cell">
            <strong>{formatDateTime(order?.createdAt)}</strong>
            <span>#{String(order?._id).slice(-8)}</span>
          </div>
        ),
        amount: formatPrice(order?.totalAmount),
        status: renderPaymentStatus(paymentStatus),
        orderStatus: renderOrderStatus(orderStatus),

        actions: (
          <>
            <Link to={`/me/order/${order?._id}`} className="btn btn-primary">
              <i className="fa fa-eye"></i>
            </Link>

            <Link
              to={`/invoice/order/${order?._id}`}
              className="btn btn-success ms-2"
            >
              <i className="fa fa-print"></i>
            </Link>
          </>
        ),
      });
    });

    return orders;
  };

  return (
    <div className="my-orders-page">
      <div className="orders-header">
        <div>
          <span className="orders-badge">My Purchases</span>
          <h1>{data?.orders?.length || 0} Orders</h1>
          <p>Track your order history and print invoices.</p>
        </div>
      </div>

      <div className="orders-table-card">
        <MDBDataTable
          data={setOrders()}
          className="orders-table"
          bordered={false}
          striped
          hover
        />
      </div>
    </div>
  );
};

export default MyOrders;