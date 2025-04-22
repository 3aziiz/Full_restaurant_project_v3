import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
  endpoints: (builder) => ({


    login: builder.mutation({
      query: (data) => ({
        url: 'api/auth/login',
        method: 'POST',
        body: data,
        credentials: "include",
      }),
    }),



    register: builder.mutation({
      query: (data) => ({
        url: 'api/auth/register',
        method: 'POST',
        body: data,
        credentials: "include",
      }),}),



      changePassword: builder.mutation({
        query: (data) => ({
          url: 'api/auth/changePassword',
          method: 'POST',
          // headers:{
          //   "authorization":`Bearer ${localStorage.getItem("token")}`
          // },
          body: data,
          credentials: "include",
           }),
         }),



         forgotPassword: builder.mutation({
          query: (data) => ({
            url: 'api/auth/forgot-password',
            method: 'POST',
            body: data,
            credentials: 'include',
          }),
        }),


    logout: builder.mutation({
     query: ()=>({
      url: 'api/auth/logout',
      method: 'POST',
      credentials: "include",
     })
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: 'api/auth/reset-password',
        method: 'POST',
        body: { token, newPassword },
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: 'api/users/profile',
        method: 'GET',
        credentials: 'include',
      }),
    }),
    
    updateAvatar: builder.mutation({
      query: (data) => ({
        url: 'api/users/avatar',
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
    }),
    updateName: builder.mutation({
      query: (data) => ({
        url: 'api/users/profile/updateName',
        method: 'PUT',
        body: { name: data.name },
        credentials: 'include',
      }),
      invalidatesTags: ['User']
    })
  }),

  });


export const { 
  useLoginMutation, 
  useRegisterMutation,
  useChangePasswordMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateAvatarMutation,
  useUpdateNameMutation,
} = apiSlice;