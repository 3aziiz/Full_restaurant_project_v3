import { USER_URL } from "../constants";
import { apiSlice } from "./apiSlice";
// import { logout } from "./authSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `auth/login`, // ✅ e.g., /api/auth/login
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch {
          console.error("Logout failed");
        }
      },
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: `auth/register`, // ✅ e.g., /api/auth/register
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: `changePassword`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    
    updatePassword: builder.mutation({
      query: (data) => ({
        url: `api/auth/changePassword`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getCurrentUser: builder.query({
      query: () => ({
        url: `${USER_URL}/me`,
        method: "GET",
        credentials: "include",
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterUserMutation,
  useForgetPasswordMutation,
  useUpdatePasswordMutation,
  useGetCurrentUserQuery
} = usersApiSlice;
