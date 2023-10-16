import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {changeVisibleSuccessRespModal} from "../../../redux/slices/VisibleModalSlice";
import MyButton from "../../myButton/MyButton";
import Modal from "@mui/material/Modal";

import s from "./SuccessRespModal.module.css"


const SuccessRespModal = () => {

    const dispatch = useDispatch();

    /*открытие и закрытие модального окна*/
    const open = useSelector(state => state.visibleModal.visibleSuccessRespModal);

    const handleClose = () => {
        dispatch(changeVisibleSuccessRespModal({visibleSuccessRespModal: false}));
    };

    const successRes = useSelector(state => state.visibleModal.successRes);


    return (
        <Modal
            open={open}
            onClose={handleClose}>
            <div className={s.modal}>

                <div className={s.successText}>
                    <h2>&nbsp;{successRes}&nbsp;</h2>

                    <MyButton style={{width: 150, justifyContent: "center"}} onClick={handleClose}>
                        OK
                    </MyButton>
                </div>

            </div>
        </Modal>
    );
};

export default SuccessRespModal;