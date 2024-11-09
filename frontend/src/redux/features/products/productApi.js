import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/baseURL";

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/products`,
    credentials: "include",
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    fetchAllProducts: builder.query({
      query: ({
        category,
        item,
        saleType,
        minPrice,
        maxPrice,
        page = 1,
        limit = 0,
      }) => {
        const queryParams = new URLSearchParams({
          category: category || "",
          item: item || "",
          saleType: saleType || "",
          minPrice: minPrice || 0,
          maxPrice: maxPrice || "",
          page: page.toString(),
          limit: limit.toString(),
        }).toString();
        return `/?${queryParams}`;
      },
      providesTags: ["Products"],
    }),
    fetchProductBySlug: builder.query({
      query: (slug) => `/${slug}`,
      providesTags: (result, error, slug) =>
        result
          ? [{ type: "Products", id: result.id }]
          : [{ type: "Products", id: slug }],
    }),
    AddProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: newProduct,
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),
    fetchRelatedProducts: builder.query({
      query: (id) => `/related/${id}`,
    }),
    updateProduct: builder.mutation({
      query: ({ id, updatedProduct }) => ({
        url: `/update-product/${id}`,
        method: "PUT",
        body: updatedProduct,
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Products", id }],
    }),
  }),
});

export const {
  useFetchAllProductsQuery,
  useFetchProductBySlugQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFetchRelatedProductsQuery,
} = productsApi;
export default productsApi;
