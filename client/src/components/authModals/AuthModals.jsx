import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import LoginModal from "../modals/login/LoginModal";
import RegistrationModal from "../modals/registration/RegistrationModal";
import LogoutModal from "../modals/logout/LogoutModal";
import ErrorEmailModal from "../modals/verificationEmailUser/ErrorEmailModal";
import ResetPasswordModal from "../modals/resetPasswordModal/ResetPasswordModal";
import ChangePasswordModal from "../modals/changePassword/ChangePasswordModal";

const AuthModals = () => {

    /*открытие модального окна авторизации*/
    const visibleLogModal = useSelector(state => state.visibleModal.visibleLoginModal);
    const [visibleLoginModal, setVisibleLoginModal] = useState(false);

    useEffect(() => {
        setVisibleLoginModal(visibleLogModal);
    }, [visibleLogModal]);


    /*открытие модального окна регистрации*/
    const visibleRegModal = useSelector(state => state.visibleModal.visibleRegistrationModal);
    const [visibleRegistrationModal, setVisibleRegistrationModal] = useState(false);

    useEffect(() => {
        setVisibleRegistrationModal(visibleRegModal);
    }, [visibleRegModal]);


    /*открытие модального окна выхода (logout)*/
    const visibleLogoutMod = useSelector(state => state.visibleModal.visibleLogoutModal);
    const [visibleLogoutModal, setVisibleLogoutModal] = useState(false);

    useEffect(() => {
        setVisibleLogoutModal(visibleLogoutMod);
    }, [visibleLogoutMod]);


    /*открытие модального окна необходимости подтверждения email*/
    const visibleErrorEmailMod = useSelector(state => state.visibleModal.visibleErrorEmailModal);
    const [visibleErrorEmailModal, setVisibleErrorEmailModal] = useState(false);

    useEffect(() => {
        setVisibleErrorEmailModal(visibleErrorEmailMod);
    }, [visibleErrorEmailMod]);


    /*открытие модального окна запроса ссылки на смену пароля*/
    const visibleResetPasswordMod = useSelector(state => state.visibleModal.visibleResetPasswordModal);
    const [visibleResetPasswordModal, setVisibleResetPasswordModal] = useState(false);

    useEffect(() => {
        setVisibleResetPasswordModal(visibleResetPasswordMod);
    }, [visibleResetPasswordMod]);


    /*открытие модального окна смены пароля*/
    const visibleChangePasswordMod = useSelector(state => state.visibleModal.visibleChangePasswordModal);
    const [visibleChangePasswordModal, setVisibleChangePasswordModal] = useState(false);

    useEffect(() => {
        setVisibleChangePasswordModal(visibleChangePasswordMod);
    }, [visibleChangePasswordMod]);


    return (

        <div>

            {visibleLoginModal && <LoginModal/>}

            {visibleRegistrationModal && <RegistrationModal/>}

            {visibleLogoutModal && <LogoutModal/>}

            {visibleErrorEmailModal && <ErrorEmailModal/>}

            {visibleResetPasswordModal && <ResetPasswordModal/>}

            {visibleChangePasswordModal && <ChangePasswordModal/>}

        </div>
    );
};

export default AuthModals;