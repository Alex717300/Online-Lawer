import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import SendNumberPhoneModal from "../components/modals/sendNumberPhone/SendNumberPhoneModal";


export const authAPI = createApi({
    reducerPath: 'userAPI',
    tagTypes: ['auth'],
    baseQuery: fetchBaseQuery(
        {
            baseUrl: 'http://localhost:5000/api/user',
            /*credentials: "include"*/
        }),

    endpoints: (build) => ({
        registrationUser: build.mutation({
            query: (body) => ({
                url: `/registration`,
                method: 'POST',
                body,
            }),
        }),

        loginUser: build.mutation({
            query: (body) => ({
                url: `/login`,
                method: 'POST',
                body,
                credentials: "include"
            }),
        }),

        activateLinkUser: build.mutation({
            query: (activationLink) => ({
                url: `/activate/${activationLink}`,
                method: 'PUT',
            }),
        }),

        logoutUser: build.mutation({
            query: (id) => ({
                url: `/logout/${id}`,
                method: 'PUT',
                credentials: "include"
            }),
        }),

        resetPassword: build.mutation({
            query: (body) => ({
                url: `/resetlink`,
                method: 'POST',
                body,
            }),
        }),

        resetLinkPassword: build.mutation({
            query: (passwordResetLink) => ({
                url: `/verificationResetLink/${passwordResetLink}`,
                method: 'PUT',
            }),
        }),

        changePassword: build.mutation({
            query: (body) => ({
                url: `/changePassword`,
                method: 'POST',
                body,
            }),
        }),

        sendNumberPhone: build.mutation({
            query: (body) => ({
                url: `/sendnumberphone`,
                method: 'POST',
                body,
            }),
        }),

    })
});

export const {
    useRegistrationUserMutation, useLoginUserMutation,
    useActivateLinkUserMutation, useLogoutUserMutation,
    useResetPasswordMutation, useResetLinkPasswordMutation,
    useChangePasswordMutation, useSendNumberPhoneMutation} = authAPI;