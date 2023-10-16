import React, {useEffect, useState} from 'react';

import {useDispatch, useSelector} from "react-redux";
import {changeVisibleResetPasswordModal} from "../../../redux/slices/VisibleModalSlice";
import {authAPI} from "../../../services/AuthService";

import Modal from "@mui/material/Modal";
import Loader from "../../loader/Loader";
import AgreeWithPolicy from "../../agreeWithPolicy/AgreeWithPolicy";
import MyButton from "../../myButton/MyButton";

import s from './ResetPasswordModal.module.css';


const ResetPasswordModal = () => {

    const dispatch = useDispatch();

    /*открытие и закрытие модального окна*/
    const open = useSelector(state => state.visibleModal.visibleResetPasswordModal);

    const handleClose = () => {
        dispatch(changeVisibleResetPasswordModal({visibleResetPasswordModal: false}));
    };

    const [visibleMainMenu, setVisibleMainMenu] = useState(true);
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [visibleErrorText, setVisibleErrorText] = useState(false);
    const [visibleSuccessText, setVisibleSuccessText] = useState(false);


    /*отправка почты на сервер для создание ссылки*/
    const [email, setEmail] = useState('');
    const [disabledBtn, setDisabledBtn] = useState(true);
    const [resetPassword, response] = authAPI.useResetPasswordMutation();
    const [textRes, setTextRes] = useState('');

    const bodyResetPassword = ({email});

    /*Согласие на обработку персональных данных*/
    const checked = useSelector(state => state.auth.checkedAgree);

    useEffect(() => {
        if (email && checked) {
            setDisabledBtn(false);
        }
        if (!email || !checked) {
            setDisabledBtn(true);
        }
    }, [email, checked]);


    const resetPass = async () => {
        setVisibleMainMenu(false);
        setVisibleLoader(true);
        await resetPassword(bodyResetPassword);
    };

    useEffect(() => {
        if (response.status === `rejected`) {
            setVisibleLoader(false);
            setVisibleMainMenu(false);
            setVisibleErrorText(true);
            if (response.error.data) {
                setTextRes(response.error.data);
            }
            if (!response.error.data) {
                setTextRes("Непредвиденная ошибка");
            }
        }
        if (response.data) {
            setVisibleLoader(false);
            setVisibleMainMenu(false);
            setTextRes(response.data);
            setVisibleSuccessText(true);
        }

    }, [response]);


    const closeErrorText = () => {
        setVisibleMainMenu(true);
        setVisibleErrorText(false);
    }

    return (

        <Modal
            open={open}
            onClose={handleClose}>
            <div className={s.main_modal}>

                {visibleMainMenu &&
                    <>
                        <div className={s.modal_inp}>

                            <h2>Для возможности смены пароля укажите свой email:</h2>

                            <input
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                                type="text"
                                placeholder='Введите email'
                            />
                        </div>

                        <AgreeWithPolicy/>

                        <div className={s.modal_btn}>
                            <MyButton disabled={disabledBtn} onClick={resetPass}>
                                <h3>Сменить пароль</h3>
                            </MyButton>

                            <MyButton onClick={handleClose}>
                                <h3>Отмена</h3>
                            </MyButton>
                        </div>
                    </>}

                {visibleErrorText &&
                    <div className={s.errorText}>
                        <h2>{textRes}</h2>
                        <MyButton style={{width: 150, justifyContent: "center"}} onClick={closeErrorText}>
                            <h3>OK</h3>
                        </MyButton>
                    </div>}

                {visibleSuccessText &&
                    <div className={s.successText}>
                        <h2>{textRes}</h2>
                        <MyButton style={{width: 150, justifyContent: "center"}} onClick={handleClose}>
                            <h3>OK</h3>
                        </MyButton>
                    </div>}

                {visibleLoader && <Loader/>}
            </div>

        </Modal>
    );
};

export default ResetPasswordModal;