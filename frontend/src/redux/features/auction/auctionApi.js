import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/baseURL";

const auctionApi = createApi({
  reducerPath: "auctionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/auction`,
    credentials: "include",
  }),
  tagTypes: ["Auction"],
  endpoints: (builder) => ({
    fetchAllAuction: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Auction"],
    }),
    fetchAuctionBySlug: builder.query({
      query: (slug) => ({
        url: `/${slug}`,
        method: "GET",
      }),
      providesTags: ["Auction"],
    }),
    addAuction: builder.mutation({
      query: (newAuction) => ({
        url: "/create-auction",
        method: "POST",
        body: newAuction,
        credentials: "include",
      }),
      invalidatesTags: ["Auction"],
    }),
    addBid: builder.mutation({
      query: ({ auctionId, userId, userName, bid }) => ({
        url: `/${auctionId}/bid`,
        method: "PUT",
        body: { userId, userName, bid },
      }),
      invalidatesTags: ["Auction"],
    }),
    updateAuction: builder.mutation({
      query: ({ editAuction, auctionId }) => ({
        url: `/edit/${auctionId}`,
        method: "PATCH",
        body: editAuction,
      }),
      invalidatesTags: ["Auction"],
    }),
    changeStatusAuction: builder.mutation({
      query: ({ status, auctionId }) => ({
        url: `/stop-continue/${auctionId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Auction"],
    }),
  }),
});

export const {
  useAddAuctionMutation,
  useFetchAllAuctionQuery,
  useAddBidMutation,
  useFetchAuctionBySlugQuery,
  useUpdateAuctionMutation,
  useChangeStatusAuctionMutation,
} = auctionApi;

export default auctionApi;
