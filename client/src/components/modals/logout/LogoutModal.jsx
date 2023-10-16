import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {changeVisibleLogoutModal} from "../../../redux/slices/VisibleModalSlice";
import {useNavigate} from "react-router-dom";

import {authAPI} from "../../../services/AuthService";
import {changeAuthUserStatus} from "../../../redux/slices/AuthSlice";

import Modal from "@mui/material/Modal";

import s from './LogoutModal.module.css';
import Loader from "../../loader/Loader";


const LogoutModal = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    /*открытие и закрытие модального окна*/
    const open = useSelector(state => state.visibleModal.visibleLogoutModal);

    const handleClose = () => {
        dispatch(changeVisibleLogoutModal({visibleLogoutModal: false}));
    };

    /*удаление токена на сервере и очитска localStorage*/
    const [deleteToken, response] = authAPI.useLogoutUserMutation();
    const [visibleMainMenu, setVisibleMainMenu] = useState(true);
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [visibleErrorText, setVisibleErrorText] = useState(false);
    const [errorText, setErrorText] = useState('');
    const userId = localStorage.getItem('userId');

    const authFalse = () => {
        dispatch(changeAuthUserStatus({authorization: false}));
    };

    const goToMainPage = () => {
        navigate("/");
    };

    const logoutUser = () => {
        setVisibleMainMenu(false);
        setVisibleLoader(true);
        deleteToken(userId);
        localStorage.clear();
        authFalse();
    };

    useEffect(() => {
        if (response.status === `rejected`) {
            setVisibleLoader(false);
            setVisibleMainMenu(false);
            setVisibleErrorText(true);
            setErrorText("Непредвиденная ошибка");
        }
        if (response.data === "Успешный выход") {
            handleClose();
        }
    }, [response]);

    useEffect(() => {
        if (!open) {
            goToMainPage();
            refreshPage();
        }
    }, [open]);

    function refreshPage() {
        window.location.reload();
    }

    return (

        <Modal
            open={open}
            onClose={handleClose}>
            <div className={s.modal}>

                {visibleMainMenu &&
                    <>
                        <h3>Действительно хотите выйти?</h3>

                        <button onClick={logoutUser}>
                            Выйти
                        </button>

                        <button onClick={handleClose}>
                            Отмена
                        </button>
                    </>}

                {visibleErrorText &&
                    <div>
                        <h3>{errorText}</h3>
                        <button onClick={handleClose}>OK</button>
                    </div>
                }

                {visibleLoader && <Loader/>}

            </div>
        </Modal>


    );
};

export default LogoutModal;