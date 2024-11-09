import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/baseURL";

const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    credentials: "include",
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    createNewOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/payment-process",
        method: "POST",
        body: newOrder,
        credentials: "include",
      }),
      invalidatesTags: ["Orders"],
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: "/payment-confirm",
        method: "POST",
        body: order,
        credentials: "include",
      }),
      invalidatesTags: ["Orders"],
    }),
    getUserOrder: builder.query({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
    fetchAllOrders: builder.query({
      query: ({ status, page = 1, limit = 10 }) => {
        const queryParams = new URLSearchParams({
          status: status || "",
          page: page.toString(),
          limit: limit.toString(),
        }).toString();
        return `?${queryParams}`;
      },
      providesTags: ["Orders"],
    }),
    fetchSingleOrder: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, orderStatus }) => ({
        url: `/status/${orderId}`,
        method: "PUT",
        body: { orderStatus },
      }),
      invalidatesTags: ["Orders"],
    }),
    payRemaining: builder.mutation({
      query: (remainingPayment) => ({
        url: "/remaining-payment",
        method: "POST",
        body: remainingPayment,
        credentials: "include",
      }),
      invalidatesTags: ["Orders"],
    }),
    payOrder: builder.mutation({
      query: (orderId) => ({
        url: "/pay-order",
        method: "POST",
        body: orderId,
        credentials: "include",
      }),
      invalidatesTags: ["Orders"],
    }),
    cancelOrder: builder.mutation({
      query: ({ orderId, cartItems }) => ({
        url: `/cancel-order/${orderId}`,
        method: "DELETE",
        body: { cartItems },
        credentials: "include",
      }),
      invalidatesTags: ["Orders"],
    }),
    auctionOrdering: builder.mutation({
      query: ({ orderId, auctionOrder }) => ({
        url: `/auction-order/${orderId}`,
        method: "PUT",
        body: auctionOrder,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useCreateNewOrderMutation,
  useCreateOrderMutation,
  useGetUserOrderQuery,
  useFetchAllOrdersQuery,
  useFetchSingleOrderQuery,
  useUpdateOrderStatusMutation,
  usePayRemainingMutation,
  usePayOrderMutation,
  useCancelOrderMutation,
  useAuctionOrderingMutation,
} = orderApi;

export default orderApi;
