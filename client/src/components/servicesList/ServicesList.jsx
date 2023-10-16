import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {changeVisibleSendNumberPhoneModal} from "../../redux/slices/VisibleModalSlice";

import MyButton from "../myButton/MyButton";
import SendNumberPhoneModal from "../modals/sendNumberPhone/SendNumberPhoneModal";
import ErrorModal from "../modals/error/ErrorModal";

import s from "./ServicesList.module.css";


const ServicesList = () => {

    const services = [
        {id: 1, description: "Консультация юриста"},
        {id: 2, description: "Представление интересов в суде"},
        {id: 3, description: "Составление договоров, соглашений, актов выполненных работ и т.д."},
        {id: 4, description: "Представление интересов в правоохранительных органах и органах гос.власти"},
        {id: 5, description: "Абонентское обслуживание юридических лиц"},
        {id: 6, description: "Составление процессуальных документов: исковых заявлений, " +
                "жалоб, претензий, ходатайств и т.д."},
    ];

    const dispatch = useDispatch();

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

        <div className={s.servicesList}>

            <h1>Услуги:</h1>

            {services.map((service) => (
                    <MyButton key={service.id} onClick={openSendNumberPhone}>
                       <h2> {service.description} </h2>
                    </MyButton>
            ))}

            {visibleSendNumberPhoneModal && <SendNumberPhoneModal/>}

            {visibleErrorModal && <ErrorModal/>}

        </div>

    );
};

export default ServicesList;