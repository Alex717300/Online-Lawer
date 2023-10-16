import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    changeVisibleLoginModal,
    changeVisibleRegistrationModal,
    changeVisibleResetPasswordModal
} from "../../../redux/slices/VisibleModalSlice";

import {authAPI} from "../../../services/AuthService";
import {changeAuthUserStatus} from "../../../redux/slices/AuthSlice";

import Loader from "../../loader/Loader";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import PreviewIcon from "@mui/icons-material/Preview";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AgreeWithPolicy from "../../agreeWithPolicy/AgreeWithPolicy";

import s from "./LoginModal.module.css";


const LoginModal = () => {

    const dispatch = useDispatch();

    /*открытие и закрытие модального окна авторизации*/
    const open = useSelector(state => state.visibleModal.visibleLoginModal);

    const handleClose = () => {
        dispatch(changeVisibleLoginModal({visibleLoginModal: false}));
    };

    /*видимость основного меню окна логина, загрузки, ошибки, пароля*/
    const [visibleMainMenu, setVisibleMainMenu] = useState(true);
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [visibleErrorText, setVisibleErrorText] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [noVisiblePassword, setNoVisiblePassword] = useState(true);
    const [typePassword, setTypePassword] = useState("password");

    /*отправка почты и пароля на сервер для входа*/
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loginUser, response] = authAPI.useLoginUserMutation();

    const [textRes, setTextRes] = useState('');
    const [disabledBtn, setDisabledBtn] = useState(true);

    const bodyLogin = ({email, password});

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

    const userLogin = async () => {
        setVisibleMainMenu(false);
        setVisibleLoader(true);
        await loginUser(bodyLogin);
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


    const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [isActivated, setIsActivated] = useState(false);

    const getAuthUserStatus = () => {
        dispatch(changeAuthUserStatus({authorization: true}));
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        }
        if (userId) {
            localStorage.setItem('userId', userId);
        }
        if (userName) {
            localStorage.setItem('userName', userName);
        }
        if (userRole) {
            localStorage.setItem('userRole', userRole);
        }
        if (isActivated) {
            localStorage.setItem('isActivated', isActivated);
        }
        if (userId && userName) {
            getAuthUserStatus();
            localStorage.setItem('authUser', true);
            handleClose();
        }

    }, [token, userId, userName]);


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
        if (response.data && response.data.accessToken) {
            setToken(response.data.accessToken)
            setUserId(response.data.userDto.id)
            setUserName(response.data.userDto.name)
            setUserRole(response.data.userDto.role)
            setIsActivated(response.data.userDto.isActivated)
            setVisibleLoader(false);
            setVisibleMainMenu(false);
        }

    }, [response]);


    const closeErrorText = () => {
        setVisibleMainMenu(true);
        setVisibleErrorText(false);
    }


    /*открытие модального окна запроса ссылки на смену пароля*/
    const openResetPasswordModal = () => {
        dispatch(changeVisibleResetPasswordModal({visibleResetPasswordModal: true}));
        handleClose();
    }

    /*открытие модального окна регистрации*/
    const openRegistrationModal = () => {
        dispatch(changeVisibleRegistrationModal({visibleRegistrationModal: true}));
        handleClose();
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}>
            <div className={s.modal}>

                {visibleMainMenu &&
                    <>
                        <h3>для доступа необходимо авторизоваться</h3>
                        <div className={s.modal_login_form}>

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
                                    placeholder='Введите пароль (не менее 5 символов)'
                                />

                                {noVisiblePassword &&
                                    <Tooltip placement="right-end" title="Показать пароль">
                                        <VisibilityOffIcon onClick={visiblePass}/>
                                    </Tooltip>}

                                {visiblePassword &&
                                    <Tooltip placement="right-end" title="Скрыть пароль">
                                        <PreviewIcon onClick={noVisiblePass}/>
                                    </Tooltip>}

                            </div>

                        </div>

                        <AgreeWithPolicy/>

                        <button disabled = {disabledBtn} onClick={userLogin}>
                            Войти
                        </button>

                        <button onClick={handleClose}>
                            Отмена
                        </button>

                        <div className={s.openReg}>
                            <p>Если забыли пароль</p>
                            <button onClick={openResetPasswordModal}>
                                Сменить пароль
                            </button>
                        </div>

                        <div className={s.openReg}>
                            <p>Если у Вас нет учетной записи</p>
                            <button onClick={openRegistrationModal}>
                                Зарегистрируйтесь
                            </button>
                        </div>
                    </>
                }

                {visibleErrorText &&
                    <div>
                        <h3>{textRes}</h3>
                        <button onClick={closeErrorText}>OK</button>
                    </div>
                }

                {visibleLoader && <Loader/>}

            </div>
        </Modal>
    );
};

export default LoginModal;