import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {changeVisibleErrorModal} from "../../../redux/slices/VisibleModalSlice";

import Modal from "@mui/material/Modal";
import s from './ErrorModal.module.css';


const ErrorModal = () => {
    const dispatch = useDispatch();

    /*открытие и закрытие модального окна*/
    const open = useSelector(state => state.visibleModal.visibleErrorModal);

    const handleClose = () => {
        dispatch(changeVisibleErrorModal({visibleErrorModal: false}));
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}>
            <div className={s.modal}>
                <div>
                    <h2>
                        Что-то пошло не так... 😕
                    </h2>
                </div>

                <div className={s.modal_btn}>
                    <button style={{width:180, justifyContent:"center"}} onClick={handleClose}>
                        <h3>OK</h3>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ErrorModal;