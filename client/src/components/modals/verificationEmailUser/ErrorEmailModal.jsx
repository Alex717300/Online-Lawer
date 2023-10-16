import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {changeVisibleErrorEmailModal} from "../../../redux/slices/VisibleModalSlice";
import Modal from "@mui/material/Modal";

import s from "./VerificationEmailUserModal.module.css";

const ErrorEmailModal = () => {

    const dispatch = useDispatch();

    /*открытие и закрытие модального окна*/
    const open = useSelector(state => state.visibleModal.visibleErrorEmailModal);

    const handleClose = () => {
        dispatch(changeVisibleErrorEmailModal({visibleErrorEmailModal: false}));
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}>
            <div className={s.modal}>

                <h3>Ваш email не подтвержден</h3>
                <h3>для подтверждения email перейдите по ссылке в письме</h3>
                <button onClick={handleClose}>OK</button>

            </div>
        </Modal>
    );
};

export default ErrorEmailModal;