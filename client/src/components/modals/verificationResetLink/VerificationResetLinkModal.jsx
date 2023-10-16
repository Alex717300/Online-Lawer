import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    changeVisibleChangePasswordModal,
    changeVisibleVerificationResetLinkModal
} from "../../../redux/slices/VisibleModalSlice";
import {authAPI} from "../../../services/AuthService";

import MyButton from "../../myButton/MyButton";
import Loader from "../../loader/Loader";
import Modal from "@mui/material/Modal";

import s from './VerificationResetLinkModal.module.css';


const VerificationResetLinkModal = () => {

    const {passwordResetLink} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /*открытие и закрытие модального окна*/
    const open = useSelector(state => state.visibleModal.visibleVerificationResetLinkModal);

    const handleClose = () => {
        dispatch(changeVisibleVerificationResetLinkModal({visibleVerificationResetLinkModal:false}))
    };

    const [visibleMainMenu, setVisibleMainMenu] = useState(false);
    const [visibleLoader, setVisibleLoader] = useState(false);


    /*отправка ссылки отмены пароля для проверки почты*/
    const [verificationEmailUser, response] = authAPI.useResetLinkPasswordMutation();
    const [textRes, setTextRes] = useState('');

    useEffect(() => {
        if (passwordResetLink) {
            setVisibleMainMenu(false);
            setVisibleLoader(true);
            verificationEmailUser(passwordResetLink)
        }

    }, [passwordResetLink]);

    useEffect(() => {
        if (response.status === `rejected`) {
            setVisibleLoader(false);
            setVisibleMainMenu(true);
            if (response.error.data) {
                setTextRes(response.error.data);
            }
            if (!response.error.data) {
                setTextRes("Непредвиденная ошибка");
            }
        }
        if (response.data === "90104028-722b-4eb0-b1e7-e307f735255b") {
            dispatch(changeVisibleChangePasswordModal({visibleChangePasswordModal: true}));
            handleClose();
        }

    }, [response]);

    useEffect(() => {
        if (!open) {
            navigate(`/`);
        }
    }, [open]);

    return (
        <Modal
            open={open}
            onClose={handleClose}>
            <div className={s.modal}>

                {visibleMainMenu &&
                    <div className={s.errorText}>
                        <h2>{textRes}</h2>
                        <MyButton style={{width: 150, justifyContent: "center"}} onClick={handleClose}>
                            <h3>OK</h3>
                        </MyButton>
                    </div>
                }

                {visibleLoader && <Loader/>}

            </div>
        </Modal>
    );
};

export default VerificationResetLinkModal;