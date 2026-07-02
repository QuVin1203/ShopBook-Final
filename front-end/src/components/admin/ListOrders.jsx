import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";

import AdminLayout from "../layout/AdminLayout";
import {
  useDeleteOrderMutation,
  useGetAdminOrdersQuery,
} from "../../redux/api/orderApi";
import Loader from "../layout/Loader";

const ListOrders = () => {
  const { data, isLoading, error } = useGetAdminOrdersQuery();

  const [
    deleteOrder,
    { error: deleteError, isLoading: isDeleteLoading, isSuccess },
  ] = useDeleteOrderMutation();

  useEffect(() => {
    if (error) toast.error(error?.data?.message);
    if (deleteError) toast.error(deleteError?.data?.message);
    if (isSuccess) toast.success("Order deleted");
  }, [error, deleteError, isSuccess]);

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

  const deleteOrderHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteOrder(id);
    }
  };

  const getPaymentStatus = (order) => {
    if (order?.paymentStatus) return order.paymentStatus;

    const paymentInfo = String(order?.paymentInfo || "").toUpperCase();

    if (paymentInfo === "PAID") return "PAID";
    if (paymentInfo.includes("PENDING")) return "PENDING";

    return "UNPAID";
  };

  const getPaymentStatusBadge = (status) => {
    if (status === "PAID") {
      return <span className="badge bg-success">PAID</span>;
    }

    if (status === "PENDING") {
      return <span className="badge bg-warning text-dark">PENDING</span>;
    }

    return <span className="badge bg-danger">UNPAID</span>;
  };

  const getOrderStatusBadge = (status) => {
    if (status === "Delivered") {
      return <span className="badge bg-success">Delivered</span>;
    }

    if (status === "Shipped") {
      return <span className="badge bg-info text-dark">Shipped</span>;
    }

    return <span className="badge bg-warning text-dark">Processing</span>;
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
          label: "Customer",
          field: "customer",
          sort: "asc",
        },
        {
          label: "Books",
          field: "books",
          sort: "asc",
        },
        {
          label: "Total",
          field: "total",
          sort: "asc",
        },
        {
          label: "Payment Status",
          field: "paymentStatus",
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
            <br />
            <small>#{String(order?._id).slice(-8)}</small>
          </div>
        ),

        customer: (
          <div className="admin-order-customer">
            <strong>{order?.user?.name || "Unknown"}</strong>
            <br />
            <small>{order?.shippingInfo?.phoneNo || ""}</small>
          </div>
        ),

        books: (
          <div className="admin-order-books">
            {order?.orderItems?.map((item) => (
              <div key={item?.product} className="admin-order-book-item">
                <strong>{item?.name}</strong>
                <br />
                <small>
                  {item?.quantity} × {formatPrice(item?.price)}
                </small>
              </div>
            ))}
          </div>
        ),

        total: <strong>{formatPrice(order?.totalAmount)}</strong>,

        paymentStatus: getPaymentStatusBadge(paymentStatus),
        orderStatus: getOrderStatusBadge(orderStatus),

        actions: (
  <div className="admin-order-actions">
    <Link
      to={`/admin/orders/${order?._id}`}
      className="btn btn-outline-primary"
    >
      <i className="fa fa-pencil"></i>
    </Link>

    <button
      className="btn btn-outline-danger"
      onClick={() => deleteOrderHandler(order?._id)}
      disabled={isDeleteLoading}
    >
      <i className="fa fa-trash"></i>
    </button>
  </div>
),
      });
    });

    return orders;
  };

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
      <h1 className="my-5">{data?.orders?.length || 0} Orders</h1>

      <MDBDataTable
  data={setOrders()}
  className="px-3 admin-orders-table"
  bordered={false}
  striped={false}
  hover
/>
    </AdminLayout>
  );
};

export default ListOrders;