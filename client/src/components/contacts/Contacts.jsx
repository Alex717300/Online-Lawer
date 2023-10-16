import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {changeVisibleSendNumberPhoneModal} from "../../redux/slices/VisibleModalSlice";

import {useClipboard} from 'use-clipboard-copy';

import MyButton from "../myButton/MyButton";
import ErrorModal from "../modals/error/ErrorModal";
import SendNumberPhoneModal from "../modals/sendNumberPhone/SendNumberPhoneModal";

import ViberIcon from "../../static/1419154_viber_icon.png";
import WhatsappIcon from "../../static/593 whatsapp_icon.png";
import EmailIcon from "../../static/elektron_pochta.png";

import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {Tooltip} from "@mui/material";

import s from './Contacts.module.css';


const Contacts = () => {

    const dispatch = useDispatch();

    const clipboard = useClipboard({copiedTimeout: 1000});

    /*открытие модального окна отправки номера тлф для заказа обратного звонка*/
    const visibleSendNumberPhoneMod = useSelector(state => state.visibleModal.visibleSendNumberPhoneModal);
    const [visibleSendNumberPhoneModal, setVisibleSendNumberPhoneModal] = useState(false);

    useEffect(() => {
        setVisibleSendNumberPhoneModal(visibleSendNumberPhoneMod);
    }, [visibleSendNumberPhoneMod]);

    const openSendNumberPhone = () => {
        dispatch(changeVisibleSendNumberPhoneModal({visibleSendNumberPhoneModal: true}))
    }

    /*открытие модального окна ошибки*/
    const visibleErrModal = useSelector(state => state.visibleModal.visibleErrorModal);
    const [visibleErrorModal, setVisibleErrorModal] = useState(false);

    useEffect(() => {
        setVisibleErrorModal(visibleErrModal);
    }, [visibleErrModal]);

    return (

        <div className={s.contacts}>

            <h1>
                Позвонить или написать нам:
            </h1>

            <div className={s.callContacts}>
                <a href="tel:89141389744">
                    <MyButton>
                        <PhoneForwardedIcon/>
                        <h3> Позвонить </h3>
                    </MyButton>
                </a>


                <MyButton style={{marginLeft: 15}} onClick={() => clipboard.copy('89141389744')}>
                    <Tooltip componentsProps={{tooltip: {sx: {fontSize: 15, color: "greenyellow"}}}}
                             placement="right-end"
                             title={clipboard.copied ? 'Скопировано' : 'Копировать номер телефона'}>
                        <ContentCopyIcon/>
                    </Tooltip>
                </MyButton>


            </div>

            <MyButton onClick={openSendNumberPhone}>
                <h3>Заказать обратный звонок </h3>
            </MyButton>


            <div className={s.callContacts}>
                <a href="viber://chat?number=%2B79141389744">
                    <MyButton>
                        <img style={{height: 30, width: 30}} src={ViberIcon}/>
                        <h3> Viber </h3>
                    </MyButton>
                </a>
            </div>

            <div className={s.callContacts}>
                <a href="https://api.whatsapp.com/send?phone=79141389744">
                    <MyButton>
                        <img style={{height: 30, width: 30}} src={WhatsappIcon}/>
                        <h3> Whatsapp </h3>
                    </MyButton>
                </a>
            </div>

            <div className={s.callContacts}>

                <a href="mailto:onlinelawer@gmail.com">
                    <MyButton>
                        <img style={{height: 30, width: 30}} src={EmailIcon}/>
                        <h3> Почта </h3>
                    </MyButton>
                </a>


                <MyButton style={{marginLeft: 15}} onClick={() => clipboard.copy('onlinelawer@gmail.com')}>
                    <Tooltip componentsProps={{tooltip: {sx: {fontSize: 15, color: "greenyellow"}}}}
                             placement="right-end"
                             title={clipboard.copied ? 'Скопировано' : 'Копировать адрес электронной почты'}>
                        <ContentCopyIcon/>
                    </Tooltip>
                </MyButton>


            </div>

            {visibleSendNumberPhoneModal && <SendNumberPhoneModal/>}

            {visibleErrorModal && <ErrorModal/>}

        </div>
    );
};

export default Contacts;