import React, { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useLazyGetDashboardSalesQuery } from "../../redux/api/orderApi.js";
import toast from "react-hot-toast";
import Loader from "../layout/Loader.jsx";

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [getDashboardSales, { error, isLoading, data }] =
    useLazyGetDashboardSalesQuery();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }

    if (startDate && endDate && !data) {
      getDashboardSales({
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });
    }
  }, [error, startDate, endDate, data, getDashboardSales]);

  const submitHandler = () => {
    getDashboardSales({
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    });
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN");
  };

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
      <div className="admin-dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Track sales, orders and business performance.</p>
          </div>
        </div>

        <div className="dashboard-filter-card">
          <div className="dashboard-date-group">
            <div className="dashboard-date-item">
              <label>Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="form-control dashboard-date-input"
              />
            </div>

            <div className="dashboard-date-item">
              <label>End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="form-control dashboard-date-input"
              />
            </div>

            <button className="dashboard-fetch-btn" onClick={submitHandler}>
              Fetch Report
            </button>
          </div>
        </div>

        <div className="dashboard-stats-grid">
          <div className="dashboard-stat-card sales-card">
            <div className="stat-icon">📚</div>
            <div>
              <p>Book Revenue</p>
              <h2>{formatPrice(data?.totalSales)} ₫</h2>
            </div>
          </div>

          

          

          
          <div className="dashboard-stat-card orders-card">
            <div className="stat-icon">🧾</div>
            <div>
              <p>Total Orders</p>
              <h2>{data?.totalNumOrders || 0}</h2>
            </div>
          </div>

        </div>

         <div className="dashboard-stat-card shipping-card">
    <div className="stat-icon">🚚</div>
    <div>
      <p>Shipping</p>
      <h2>{data?.shippedOrders || 0}</h2>
    </div>
  </div>

  <div className="dashboard-stat-card delivered-card">
    <div className="stat-icon">✅</div>
    <div>
      <p>Delivered</p>
      <h2>{data?.deliveredOrders || 0}</h2>
    </div>
  </div>

       

        <div className="dashboard-bottom-grid">
          <div className="dashboard-table-card">
            <h3>🏆 Top Selling Books</h3>

            {data?.topSellingBooks?.length > 0 ? (
              data?.topSellingBooks?.map((book, index) => (
                <div className="dashboard-list-row" key={book?._id}>
                  <div className="dashboard-book-info">
                    <span>
                      {index + 1}. {book?.name}
                    </span>
                  </div>

                  <strong>{book?.sold || 0} sold</strong>
                </div>
              ))
            ) : (
              <p className="dashboard-empty-text">No sold books yet.</p>
            )}
          </div>

         <div className="dashboard-table-card">
  <h3>🧾 Recent Orders</h3>

  {data?.recentOrders?.length > 0 ? (
    data?.recentOrders?.map((order) => (
      <div className="dashboard-list-row" key={order?._id}>
        <div>
          <span>{order?.user?.name || "Unknown user"}</span>
          <p className="dashboard-order-date">
            {new Date(order?.createdAt).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="dashboard-order-money">
          <strong>{formatPrice(order?.totalAmount)} ₫</strong>
        </div>
      </div>
    ))
  ) : (
    <p className="dashboard-empty-text">No recent orders.</p>
  )}
</div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;