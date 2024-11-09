import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/baseURL";

const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/category`,
    credentials: "include",
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    fetchAllCategory: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    addCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/create-category",
        method: "POST",
        body: newCategory,
      }),
      providesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/${categoryId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useFetchAllCategoryQuery,
  useDeleteCategoryMutation,
} = categoryApi;
export default categoryApi;
