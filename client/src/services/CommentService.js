import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
    changeVisibleAddCommentModal, changeVisibleDeleteCommentModal,
    changeVisibleErrorForbiddenModal,
    changeVisibleErrorModal,
    changeVisibleLoginModal, changeVisibleUpdateCommentModal
} from "../redux/slices/VisibleModalSlice";
import {changeAuthUserStatus} from "../redux/slices/AuthSlice";



const baseQuery = fetchBaseQuery(
    {
        baseUrl: 'http://localhost:5000/api',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
        credentials: "include"
    })

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    if (result.error && result.error.status === 401) {
        const refreshResult = await baseQuery({url: '/user/refresh', credentials: "include"}, api, extraOptions)
        if (refreshResult.data) {
            localStorage.setItem('token', refreshResult.data.accessToken);
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(changeVisibleAddCommentModal({visibleAddCommentModal: false}));
            api.dispatch(changeAuthUserStatus({authorization: false}));
            api.dispatch(changeVisibleDeleteCommentModal({visibleDeleteCommentModal: false}));
            api.dispatch(changeVisibleUpdateCommentModal({visibleUpdateCommentModal: false}));
            localStorage.clear();
            api.dispatch(changeVisibleLoginModal({visibleLoginModal: true}));
        }
    }
    if (result.error && result.error.status !== 401) {
        api.dispatch(changeVisibleAddCommentModal({visibleAddCommentModal: false}));
        api.dispatch(changeAuthUserStatus({authorization: false}));
        api.dispatch(changeVisibleDeleteCommentModal({visibleDeleteCommentModal: false}));
        api.dispatch(changeVisibleUpdateCommentModal({visibleUpdateCommentModal: false}));
        if (result.error.status === 403) {
            api.dispatch(changeVisibleErrorForbiddenModal({visibleErrorForbiddenModal: true}));
        } else
        api.dispatch(changeVisibleErrorModal({visibleErrorModal: true}));
    }
    return result
}


export const commentAPI = createApi({
    reducerPath: 'commentAPI',
    tagTypes: ['Comment'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({

        addComment: build.mutation({
            query: (body) => ({
                url: `/comment`,
                method: 'POST',
                body: body,
            }),
            invalidatesTags: ['Comment'],
        }),

        getAllComments: build.query({
            query: () => `/comment`,
            providesTags: ['Comment'],
        }),

        getForModeration: build.query({
            query: (userId) => `/comment/getformoderation/${userId}`,
            providesTags: ['Comment'],
        }),

        updateAfterModeration: build.mutation({
            query: (body) => ({
                url: `/comment/updateaftermoderation`,
                method: 'PUT',
                body: body,
            }),
            invalidatesTags: ['Comment'],
        }),

        getForEditor: build.query({
            query: (userId) => `/comment/getforeditor/${userId}`,
            providesTags: ['Comment'],
        }),

        updateComment: build.mutation({
            query: (body) => ({
                url: `/comment`,
                method: 'PUT',
                body: body,
            }),
            invalidatesTags: ['Comment'],
        }),

        deleteComment: build.mutation({
            query: (id) => ({
                url: `/comment/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Comment'],
        }),

    })
});

export const {
    useAddCommentMutation, useGetAllCommentsQuery, useGetForModerationQuery, useUpdateAfterModerationMutation,
    useGetForEditorQuery, useUpdateCommentMutation, useDeleteCommentMutation
} = commentAPI;
