import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {authAPI} from "../../../services/AuthService";
import {changeVisibleRegistrationModal} from "../../../redux/slices/VisibleModalSlice";

import PreviewIcon from '@mui/icons-material/Preview';
import Tooltip from "@mui/material/Tooltip";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Loader from "../../loader/Loader";
import Modal from "@mui/material/Modal";
import AgreeWithPolicy from "../../agreeWithPolicy/AgreeWithPolicy";


import s from "./RegistrationModal.module.css";


const RegistrationModal = () => {

    const dispatch = useDispatch();

    /*открытие и закрытие модального окна*/
    const open = useSelector(state => state.visibleModal.visibleRegistrationModal);

    const handleClose = () => {
        dispatch(changeVisibleRegistrationModal({visibleRegistrationModal: false}));
    };


    /*отправка имени, почты и пароля на сервер для регистрации*/
    const [visibleMainMenu, setVisibleMainMenu] = useState(true);
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [visibleErrorText, setVisibleErrorText] = useState(false);
    const [visibleSuccessText, setVisibleSuccessText] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [noVisiblePassword, setNoVisiblePassword] = useState(true);
    const [typePassword, setTypePassword] = useState("password");

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const role = "USER";

    const [registrationUser, response] = authAPI.useRegistrationUserMutation();
    const [textRes, setTextRes] = useState('');
    const [disabledBtn, setDisabledBtn] = useState(true);

    const bodyRegistration = ({name, email, password, role});

    /*Согласие на обработку персональных данных*/
    const checked = useSelector(state => state.auth.checkedAgree);

    useEffect(() => {
        if (name && email && password && checked) {
            setDisabledBtn(false);
        }
        if (!name || !email || !password || !checked) {
            setDisabledBtn(true);
        }
    }, [name, email, password, checked]);

    const userRegistration = async () => {
        setVisibleMainMenu(false);
        setVisibleLoader(true);
        await registrationUser(bodyRegistration);
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
    }

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
            setVisibleSuccessText(true);
            setTextRes(response.data);
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
                        <div className={s.modal_login_form}>

                            <input
                                onChange={e => setName(e.target.value)}
                                value={name}
                                type="text"
                                placeholder='Введите имя'
                            />

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

                        <button disabled={disabledBtn} onClick={userRegistration}>
                            Зарегистрироваться
                        </button>

                        <button onClick={handleClose}>
                            Отмена
                        </button>

                    </>
                }

                {visibleErrorText &&
                    <div>
                        <h3>{textRes}</h3>
                        <button onClick={closeErrorText}>OK</button>
                    </div>
                }

                {visibleSuccessText &&
                    <div>
                        <h3>{textRes}</h3>
                        <button onClick={handleClose}>OK</button>
                    </div>
                }

                {visibleLoader && <Loader/>}

            </div>
        </Modal>
    );
};

export default RegistrationModal;