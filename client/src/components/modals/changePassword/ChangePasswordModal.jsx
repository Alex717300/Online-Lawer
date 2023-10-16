import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {changeVisibleChangePasswordModal} from "../../../redux/slices/VisibleModalSlice";
import {authAPI} from "../../../services/AuthService";

import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import MyButton from "../../myButton/MyButton";
import Loader from "../../loader/Loader";
import AgreeWithPolicy from "../../agreeWithPolicy/AgreeWithPolicy";

import s from './ChangePasswordModal.module.css';


const ChangePasswordModal = () => {

    const dispatch = useDispatch();

    /*открытие и закрытие модального окна авторизации*/
    const open = useSelector(state => state.visibleModal.visibleChangePasswordModal);

    const handleClose = () => {
        dispatch(changeVisibleChangePasswordModal({visibleChangePasswordModal: false}));
    };

    const [visibleMainMenu, setVisibleMainMenu] = useState(true);
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [visibleErrorText, setVisibleErrorText] = useState(false);
    const [visibleSuccessText, setVisibleSuccessText] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [noVisiblePassword, setNoVisiblePassword] = useState(true);
    const [typePassword, setTypePassword] = useState("password");

    /*отправка почты и пароля на сервер*/
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [changePassword, response] = authAPI.useChangePasswordMutation();
    const [textRes, setTextRes] = useState('');
    const [disabledBtn, setDisabledBtn] = useState(true);

    const bodyChangePassword = ({email, password});

    /*Согласие на обработку персональных данных*/
    const checked = useSelector(state => state.auth.checkedAgree);

    useEffect(() => {
        if (email && password && checked) {
            setDisabledBtn(false);
        }
        if (!email || !password || !checked) {
            setDisabledBtn(true);
        }
    }, [email, password, checked]);

    const saveNewPassword = async () => {
        setVisibleMainMenu(false);
        setVisibleLoader(true);
        await changePassword(bodyChangePassword);
    };

    const visiblePass = () => {
        setVisiblePassword(true);
        setNoVisiblePassword(false);
        setTypePassword("text");
    };

    const noVisiblePass = () => {
        setNoVisiblePassword(true);
        setVisiblePassword(false);
        setTypePassword("password");
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
            <div className={s.modal}>

                {visibleMainMenu &&
                    <>
                        <div className={s.modal_inp}>

                            <h2>Введите свой email и новый пароль</h2>

                            <input
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                                type="text"
                                placeholder='Введите email'
                            />

                            <div className={s.pass_inp}>
                                <input
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                    type={typePassword}
                                    placeholder='Введите новый пароль (не менее 5 символов)'
                                />

                                {noVisiblePassword &&
                                    <MyButton style={{
                                        height: 25,
                                        width: 30,
                                        marginLeft: 15,
                                        justifyContent: "center"
                                    }}
                                              onClick={visiblePass}>
                                        <Tooltip componentsProps={{tooltip: {sx: {fontSize: 15, color: "greenyellow"}}}}
                                                 placement="right-end"
                                                 title="Показать пароль">
                                            <VisibilityOffIcon/>
                                        </Tooltip>
                                    </MyButton>}


                                {visiblePassword &&
                                    <MyButton style={{
                                        height: 25,
                                        width: 30,
                                        marginLeft: 15,
                                        justifyContent: "center"
                                    }}
                                              onClick={noVisiblePass}>
                                        <Tooltip componentsProps={{tooltip: {sx: {fontSize: 15, color: "greenyellow"}}}}
                                                 placement="right-end"
                                                 title="Скрыть пароль">
                                            <RemoveRedEyeIcon/>
                                        </Tooltip>
                                    </MyButton>}
                            </div>

                        </div>

                        <AgreeWithPolicy/>

                        <div className={s.modal_btn}>
                            <MyButton disabled={disabledBtn} onClick={saveNewPassword}>
                                <h3>Сохранить новый пароль</h3>
                            </MyButton>

                            <MyButton onClick={handleClose}>
                                <h3>Отмена</h3>
                            </MyButton>
                        </div>
                    </>
                }

                {visibleErrorText &&
                    <div className={s.errorText}>
                        <h1>{textRes}</h1>
                        <MyButton style={{width: 150, justifyContent: "center"}} onClick={closeErrorText}>
                            <h3>OK</h3>
                        </MyButton>
                    </div>}

                {visibleSuccessText &&
                    <div className={s.successText}>
                        <h1>{textRes}</h1>
                        <MyButton style={{width: 150, justifyContent: "center"}} onClick={handleClose}>
                            <h3>OK</h3>
                        </MyButton>
                    </div>}

                {visibleLoader && <Loader/>}

            </div>
        </Modal>
    );
};

export default ChangePasswordModal;