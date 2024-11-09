import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/baseURL";
const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/auth`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      refetchOnMount: true,
      invalidatesTags: ["User"],
    }),
    getSingleUser: builder.query({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: { role },
      }),
      refetchOnMount: true,
      invalidatesTags: ["User"],
    }),
    editProfile: builder.mutation({
      query: (profileData) => ({
        url: `/edit-profile`,
        method: "PATCH",
        body: profileData,
      }),
    }),
    forgetPass: builder.mutation({
      query: (userEmail) => ({
        url: `/forget-password`,
        method: "POST",
        body: { email: userEmail },
      }),
    }),
    resetPass: builder.mutation({
      query: ({ userId, token, password }) => ({
        url: `/reset-password/${userId}/${token}`,
        method: "PUT",
        body: { password },
      }),
    }),
    updateAddress: builder.mutation({
      query: ({ userId, addressId, addressInfo }) => ({
        url: `/users/${userId}/address/${addressId}`,
        method: "PUT",
        body: addressInfo,
      }),
    }),
    createAddress: builder.mutation({
      query: ({ addressInfo, userId }) => ({
        url: `/user/${userId}/add-address`,
        method: "POST",
        body: addressInfo,
      }),
    }),
    deleteAddress: builder.mutation({
      query: ({ userId, addressId }) => ({
        url: `/users/${userId}/address/${addressId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation({
      query: ({ userId, password, newPassword }) => ({
        url: `/change-password/${userId}`,
        method: "PATCH",
        body: { password, newPassword },
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUserQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useEditProfileMutation,
  useGetSingleUserQuery,
  useForgetPassMutation,
  useUpdateAddressMutation,
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useChangePasswordMutation,
  useResetPassMutation,
} = authApi;
export default authApi;
