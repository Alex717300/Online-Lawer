import React, {useEffect, useState} from 'react';
import Input from 'react-phone-number-input/input';

import {useDispatch, useSelector} from "react-redux";
import {changeVisibleErrorModal, changeVisibleSendNumberPhoneModal} from "../../../redux/slices/VisibleModalSlice";
import {authAPI} from "../../../services/AuthService";

import Modal from "@mui/material/Modal";
import FaxIcon from '@mui/icons-material/Fax';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import Loader from "../../loader/Loader";
import AgreeWithPolicy from "../../agreeWithPolicy/AgreeWithPolicy";

import s from './SendNumberPhoneModal.module.css';


const SendNumberPhoneModal = () => {

    const dispatch = useDispatch();

    /*открытие и закрытие модального окна*/
    const open = useSelector(state => state.visibleModal.visibleSendNumberPhoneModal);

    const handleClose = () => {
        dispatch(changeVisibleSendNumberPhoneModal({visibleSendNumberPhoneModal: false}));
    };

    const [visibleMainMenu, setVisibleMainMenu] = useState(true);
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [visibleSuccessText, setVisibleSuccessText] = useState(false);


    /*отправка номера тлф на сервер для просьбы перезвонить*/
    /*если мобильный тлф, то ввод номера с помощью react-phone-number-input, если стационарный, то input обычный*/
    const [typePhoneMobile, setTypePhoneMobile] = useState(true);
    const [value, setValue] = useState('');
    const [numberPhone, setNumberPhone] = useState('');
    const [disabledBtn, setDisabledBtn] = useState(true);
    const [sendNumberPhone, response] = authAPI.useSendNumberPhoneMutation();
    const [textRes, setTextRes] = useState('');

    const bodyNumberPhone = ({numberPhone});

    const changetypePhoneOnLandline = () => {
        setTypePhoneMobile(false);
    };

    const changetypePhoneOnMobile = () => {
        setTypePhoneMobile(true);
    };

    const openErrorModal = () => {
        dispatch(changeVisibleErrorModal({visibleErrorModal: true}));
    };


    useEffect(() => {
        if (value) {
            setNumberPhone(value);
        }
        if (!value) {
            setNumberPhone('');
        }
    }, [value]);

    /*Согласие на обработку персональных данных*/
    const checked = useSelector(state => state.auth.checkedAgree);

    useEffect(() => {
        if (numberPhone && checked) {
            setDisabledBtn(false);
        }
        if (!numberPhone || !checked) {
            setDisabledBtn(true);
        }
    }, [numberPhone, checked]);


    const sendNumber = async () => {
        setVisibleMainMenu(false);
        setVisibleLoader(true);
        await sendNumberPhone(bodyNumberPhone);
    };

    useEffect(() => {
        if (response.status === `rejected`) {
            openErrorModal();
            handleClose();
        }
        if (response.data) {
            setVisibleLoader(false);
            setVisibleMainMenu(false);
            setTextRes(response.data);
            setVisibleSuccessText(true);
        }

    }, [response]);


    return (
        <Modal
            open={open}
            onClose={handleClose}>
            <div className={s.modal}>

                {visibleMainMenu &&
                    <>

                        <h3> Есть вопросы? Оставьте номер телефона и мы обязательно Вам перезвоним! </h3>

                        <>
                            <button onClick={changetypePhoneOnMobile}>
                                Мобильный
                                <SmartphoneIcon/>
                            </button>

                            <button onClick={changetypePhoneOnLandline}>
                                Стационарный
                                <FaxIcon/>
                            </button>
                        </>

                        <div className={s.modal_numberPhone_form}>
                            {typePhoneMobile &&
                                <>
                                    +7 <Input
                                    maxLength={13}
                                    country="RU"
                                    placeholder="Введите номер телефона"
                                    value={value}
                                    onChange={setValue}/>
                                </>}

                            {!typePhoneMobile &&
                                <>
                                    <input
                                        maxLength={32}
                                        placeholder="Введите номер телефона"
                                        value={value}
                                        onChange={e => setValue(e.target.value)}/>
                                </>}
                        </div>

                        <AgreeWithPolicy/>

                        <button disabled={disabledBtn} onClick={sendNumber}>
                            Заказать обратный звонок
                        </button>

                        <button onClick={handleClose}>
                            Отмена
                        </button>

                    </>
                }

                {visibleSuccessText &&
                    <div>
                        <h3>{textRes}</h3>
                        <button onClick={handleClose}>OK</button>
                    </div>}

                {visibleLoader && <Loader/>}

            </div>
        </Modal>
    );
};

export default SendNumberPhoneModal;