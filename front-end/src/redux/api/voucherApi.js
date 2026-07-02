import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const voucherApi = createApi({
  reducerPath: "voucherApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["Vouchers"],

  endpoints: (builder) => ({
    getActiveVouchers: builder.query({
      query: () => "/vouchers",
      providesTags: ["Vouchers"],
    }),

    getAdminVouchers: builder.query({
      query: () => "/admin/vouchers",
      providesTags: ["Vouchers"],
    }),

    createVoucher: builder.mutation({
      query: (body) => ({
        url: "/admin/vouchers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vouchers"],
    }),

    claimVoucher: builder.mutation({
      query: (id) => ({
        url: `/voucher/claim/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Vouchers"],
    }),

    deleteVoucher: builder.mutation({
      query: (id) => ({
        url: `/admin/voucher/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vouchers"],
    }),
    getMyVouchers: builder.query({
  query: () => "/my-vouchers",
  providesTags: ["Vouchers"],
}),
  }),
});

export const {
  useGetActiveVouchersQuery,
  useGetAdminVouchersQuery,
  useCreateVoucherMutation,
  useClaimVoucherMutation,
  useDeleteVoucherMutation,
  useGetMyVouchersQuery
} = voucherApi;