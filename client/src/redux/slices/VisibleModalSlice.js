import {createSlice} from '@reduxjs/toolkit';


const initialState = {
    visibleRegistrationModal: false, visibleLoginModal: false,
    visibleVerificationEmailUserModal: true, visibleInterceptorModal: false,
    visibleErrorModal: false, visibleErrorForbiddenModal: false, visibleLogoutModal: false, visibleErrorEmailModal: false,
    visibleResetPasswordModal: false, visibleVerificationResetLinkModal: true,
    visibleChangePasswordModal: false, visibleAddCommentModal: false,
    visibleSuccessRespModal: false, successRes: '',
    visibleDeleteCommentModal: false, visibleUpdateCommentModal: false,
    visibleSendNumberPhoneModal: false,
};


const visibleModalSlice = createSlice({
    name: 'visibleModal',
    initialState,
    reducers: {
        changeVisibleRegistrationModal(state, action) {
            state.visibleRegistrationModal = action.payload.visibleRegistrationModal;
        },
        changeVisibleLoginModal(state, action) {
            state.visibleLoginModal = action.payload.visibleLoginModal;
        },
        changeVisibleVerificationEmailUserModal(state, action) {
            state.visibleVerificationEmailUserModal = action.payload.visibleVerificationEmailUserModal;
        },
        changeVisibleErrorModal(state, action) {
            state.visibleErrorModal = action.payload.visibleErrorModal;
        },
        changeVisibleErrorForbiddenModal(state, action) {
            state.visibleErrorForbiddenModal = action.payload.visibleErrorForbiddenModal;
        },
        changeVisibleLogoutModal(state, action) {
            state.visibleLogoutModal = action.payload.visibleLogoutModal;
        },
        changeVisibleErrorEmailModal(state, action) {
            state.visibleErrorEmailModal = action.payload.visibleErrorEmailModal;
        },
        changeVisibleResetPasswordModal(state, action) {
            state.visibleResetPasswordModal = action.payload.visibleResetPasswordModal;
        },
        changeVisibleVerificationResetLinkModal(state, action) {
            state.visibleVerificationResetLinkModal = action.payload.visibleVerificationResetLinkModal;
        },
        changeVisibleChangePasswordModal(state, action) {
            state.visibleChangePasswordModal = action.payload.visibleChangePasswordModal;
        },
        changeVisibleAddCommentModal(state, action) {
            state.visibleAddCommentModal = action.payload.visibleAddCommentModal;
        },
        changeVisibleSuccessRespModal(state, action) {
            state.visibleSuccessRespModal = action.payload.visibleSuccessRespModal;
        },
        changeSuccessRes (state, action) {
            state.successRes = action.payload.successRes;
        },
        changeVisibleDeleteCommentModal(state, action) {
            state.visibleDeleteCommentModal = action.payload.visibleDeleteCommentModal;
        },
        changeVisibleUpdateCommentModal(state, action) {
            state.visibleUpdateCommentModal = action.payload.visibleUpdateCommentModal;
        },
        changeVisibleSendNumberPhoneModal(state, action) {
            state.visibleSendNumberPhoneModal = action.payload.visibleSendNumberPhoneModal;
        },
    }
});


export const {
    changeVisibleRegistrationModal, changeVisibleLoginModal,
    changeVisibleVerificationEmailUserModal, changeVisibleErrorModal,
    changeVisibleErrorForbiddenModal, changeVisibleLogoutModal, changeVisibleErrorEmailModal,
    changeVisibleResetPasswordModal, changeVisibleVerificationResetLinkModal,
    changeVisibleChangePasswordModal, changeVisibleAddCommentModal, changeVisibleSuccessRespModal,
    changeSuccessRes, changeVisibleDeleteCommentModal,
    changeVisibleUpdateCommentModal, changeVisibleSendNumberPhoneModal} = visibleModalSlice.actions;

export default visibleModalSlice.reducer;

