import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/baseURL";

const bannerApi = createApi({
  reducerPath: "bannerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/banners`,
    credentials: "include",
  }),
  tagTypes: ["Banners"],
  endpoints: (builder) => ({
    fetchAllBanners: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Banners"],
    }),
    addBanner: builder.mutation({
      query: (newBanner) => ({
        url: "/create-banner",
        method: "POST",
        body: newBanner,
        credentials: "include",
      }),
      invalidatesTags: ["Banners"],
    }),
  }),
});

export const { useAddBannerMutation, useFetchAllBannersQuery } = bannerApi;

export default bannerApi;
