import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {changeVisibleErrorForbiddenModal} from "../../../redux/slices/VisibleModalSlice";

import Modal from "@mui/material/Modal";
import s from './ErrorModal.module.css';


const ErrorForbiddenModal = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /*открытие и закрытие модального окна*/
    const open = useSelector(state => state.visibleModal.visibleErrorForbiddenModal);

    const handleClose = () => {
        dispatch(changeVisibleErrorForbiddenModal({visibleErrorForbiddenModal: false}));
    };

    useEffect(() => {
        if (!open) {
            navigate(`/`);
            refreshPage();
        }
    }, [open]);

    function refreshPage(){
        window.location.reload();
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}>
            <div className={s.modal}>
                <div>
                    <h2>
                       К сожалению у Вас нет доступа... 😕
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

export default ErrorForbiddenModal;