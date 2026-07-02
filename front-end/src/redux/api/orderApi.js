import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
  }),

  tagTypes: ["Order", "AdminOrders"],

  endpoints: (builder) => ({
    // ==========================
    // CREATE ORDER
    // ==========================
    createNewOrder: builder.mutation({
      query: (body) => ({
        url: "/orders/new",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),

    // ==========================
    // MY ORDERS
    // ==========================
    myOrders: builder.query({
      query: () => "/me/orders",
      providesTags: ["Order"],
    }),

    // ==========================
    // ORDER DETAILS
    // ==========================
    orderDetails: builder.query({
      query: (id) => `/orders/${id}`,
    }),

    // ==========================
    // DASHBOARD SALES
    // ==========================
    getDashboardSales: builder.query({
      query: ({ startDate, endDate }) =>
        `/admin/get_sales/?startDate=${startDate}&endDate=${endDate}`,
    }),

    // ==========================
    // ADMIN ORDERS
    // ==========================
    getAdminOrders: builder.query({
      query: () => "/admin/orders",
      providesTags: ["AdminOrders"],
    }),

    // ==========================
    // UPDATE ORDER
    // ==========================
    updateOrder: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/orders/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Order", "AdminOrders"],
    }),

    // ==========================
    // DELETE ORDER
    // ==========================
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/admin/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminOrders"],
    }),

    // ==========================
    // STRIPE PAYMENT
    // ==========================
    processPayment: builder.mutation({
      query: (body) => ({
        url: "/payment/process",
        method: "POST",
        body,
      }),
    }),

    // ==========================
    // STRIPE PUBLIC KEY
    // ==========================
    confirmPayment: builder.mutation({
  query(id) {
    return {
      url: `/admin/orders/${id}/payment`,
      method: "PUT",
    };
  },
  invalidatesTags: ["Order"],
}),
  }),
});

export const {
  useCreateNewOrderMutation,
  useMyOrdersQuery,
  useOrderDetailsQuery,
  useLazyGetDashboardSalesQuery,
  useGetAdminOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,

  // Stripe
  useProcessPaymentMutation,
  useConfirmPaymentMutation,
} = orderApi;