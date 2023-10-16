import {configureStore} from '@reduxjs/toolkit';
import {authAPI} from '../services/AuthService';
import {commentAPI} from '../services/CommentService';
import visibleModalSlice from './slices/VisibleModalSlice';
import authSlice from "./slices/AuthSlice";


export const store = configureStore({
    reducer: {
        visibleModal: visibleModalSlice,
        auth: authSlice,
        [authAPI.reducerPath]: authAPI.reducer,
        [commentAPI.reducerPath]: commentAPI.reducer,
    },
    middleware: (getDefaultMiddlware) =>
        getDefaultMiddlware().concat(authAPI.middleware, commentAPI.middleware)
});
